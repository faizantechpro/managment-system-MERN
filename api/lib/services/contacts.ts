import { Op, Sequelize } from 'sequelize';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { Diff, feedFileServiceFactory, feedServiceFactory } from './feed';
import { organizationServiceFactory } from './organizations';
import { organizationGuestServiceFactory } from './organizationGuest';
import {
  Contact,
  Deal,
  ContactOwners,
  Organization,
  sequelize,
} from '../database';
import {
  ContactModel,
  ContactModifyAttributes,
} from '../database/models/contacts';
import parseSequelizeResponse from '../utils/parseSequelizeResponse';
import ParseSequelizeResponse from '../utils/parseSequelizeResponse';
import { ExpandModel, StaticModel } from 'lib/database/helpers';
import { UserContext } from 'lib/middlewares/openapi';
import { Ownable } from './utils/Ownable';
import { followerFactory } from './follower';
import { noteServiceFactory } from './note';
import { RequireKeys } from 'lib/utils';
import {
  OrganizationAttr,
  OrganizationCreateDAO,
} from 'lib/middlewares/sequelize';
import { Forbidden, InvalidPayload } from 'lib/middlewares/exception';

export type ImportContactAttributes = RequireKeys<
  Pick<
    ContactModifyAttributes,
    | 'first_name'
    | 'last_name'
    | 'email_work'
    | 'title'
    | 'email_other'
    | 'phone_work'
    | 'phone_mobile'
    | 'phone_home'
    | 'phone_other'
    | 'organization_id'
    | 'external_id'
  >,
  'first_name' | 'last_name' | 'email_work'
> & { organization?: OrganizationCreateDAO & { name: string } };

abstract class ContactService<
  T extends ContactModel = ContactModel,
  U extends StaticModel<T> = StaticModel<T>
> extends Ownable<'contact', T> {
  constructor(model: U, user: UserContext) {
    super('contact', model, user);
  }

  async getContacts(query: any) {
    const {
      search,
      page = 1,
      limit = 10,
      is_customer = false,
      organization_id,
      order,
      ...restProps
    } = query || {};

    const querySearch = {
      ...restProps,
    };

    if (query.hasOwnProperty('cif')) {
      querySearch[Op.or] = [
        { is_customer },
        {
          cif: {
            [Op.not]: '',
          },
        },
      ];
    }

    if (organization_id) {
      if (organization_id === 'null') {
        querySearch.organization_id = null;
      } else if (organization_id === 'not_null') {
        querySearch.organization_id = {
          [Op.not]: null,
        };
      } else {
        querySearch.organization_id = organization_id;
      }
    }

    if (search) {
      const searchSplit = search.split(' ');

      if (searchSplit.length > 1) {
        querySearch[Op.and] = [
          {
            [Op.or]: [
              {
                first_name: {
                  [Op.iLike]: `%${searchSplit[0]} ${searchSplit[1]}%`,
                },
              },
              {
                last_name: {
                  [Op.iLike]: `%${searchSplit[0]} ${searchSplit[1]}%`,
                },
              },

              {
                [Op.and]: [
                  { first_name: { [Op.iLike]: `%${searchSplit[0]}%` } },
                  { last_name: { [Op.iLike]: `%${searchSplit[1]}%` } },
                ],
              },
            ],
          },
        ];

        if (query.hasOwnProperty('cif')) {
          querySearch[Op.and] = [
            ...querySearch[Op.and],
            {
              [Op.or]: [
                { is_customer },
                {
                  cif: {
                    [Op.not]: null,
                  },
                },
              ],
            },
          ];
        }
      } else {
        querySearch[Op.and] = [
          {
            [Op.or]: _.flatten(
              _.map(['first_name', 'last_name'], (item: string) => {
                return _.map(search.split(' '), (q: string) => {
                  return { [item]: { [Op.iLike]: `%${q}%` } };
                });
              })
            ),
          },
        ];

        if (query.hasOwnProperty('cif')) {
          querySearch[Op.and] = [
            ...querySearch[Op.and],
            {
              [Op.or]: [
                { is_customer },
                {
                  cif: {
                    [Op.not]: null,
                  },
                },
              ],
            },
          ];
        }
      }
    }

    const ownedFilter = await this.getOwnedFilter();

    let queryOrder = order;

    if (
      order?.length &&
      (order[0] === 'total_contacts' ||
        order[0] === 'total_open_deals' ||
        order[0] === 'total_closed_deals')
    ) {
      queryOrder = [Sequelize.literal(order[0]), order[1]];
    }

    const sequelizeAlias = 'contacts';

    const contacts = await Contact.findAndCountAll({
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              select count(d.id) from deals d where ${sequelizeAlias}.id = d.contact_person_id and d.deal_type not in ('won', 'lost')
            )`),
            'total_open_deals',
          ],
          [
            Sequelize.literal(`(
              select count(d.id) from deals d where ${sequelizeAlias}.id = d.contact_person_id and d.deal_type in ('won', 'lost')
            )`),
            'total_closed_deals',
          ],
        ],
      },
      include: ['assigned_user', 'organization', 'label'],
      where: {
        ...querySearch,
        deleted: false,
        ...ownedFilter,
      },
      limit,
      offset: limit * (page - 1),
      order: [queryOrder || ['date_modified', 'DESC']],
    });

    const dataCount = contacts.count;

    return {
      contacts: (
        contacts.rows as (ExpandModel<ContactModel> & {
          dataValues: {
            total_open_deals: number;
            total_closed_deals: number;
          };
        })[]
      ).map((row) => {
        row.dataValues.total_open_deals = Number(
          row.dataValues.total_open_deals
        );
        row.dataValues.total_closed_deals = Number(
          row.dataValues.total_closed_deals
        );

        return row;
      }),
      pagination: {
        limit: Number(limit),
        page: Number(page),
        totalPages: Math.ceil(dataCount / limit),
        count: dataCount,
      },
    };
  }

  async getContactById(id: string) {
    const filter = await this.getOwnedFilter();

    filter.id = id;
    filter.deleted = false;

    // TODO investigate a better pattern to handle ownership one step removed
    if (this.requiresOwnedFilter()) {
      const organizationService = organizationServiceFactory(this.user);
      const ownedOrgIds = await organizationService.getOwnedIds();

      if (!filter[Op.or]) {
        filter[Op.or] = [];
      }
      // `as []` cast, just trust me lol
      filter[Op.or] = [
        ...(filter[Op.or] as []),
        {
          organization_id: {
            [Op.in]: ownedOrgIds,
          },
        },
      ];
    }

    const contact = await Contact.findOne({
      where: filter,
      include: [
        'assigned_user',
        'label',
        {
          model: Organization,
          as: 'organization',
          include: ['label'],
        },
      ],
    });

    return contact;
  }

  async getByAvatarId(avatarId: string) {
    const contact = await this.model.findOne({
      where: {
        avatar: avatarId,
      },
    });

    return contact?.toJSON();
  }

  getSummary(info: Diff[]): string | undefined {
    if (info.length === 1) {
      const key = info[0].key;

      if (key.includes('email')) {
        return `E-mail address updated`;
      } else if (key.includes('phone')) {
        return `Phone updated`;
      }
    }
  }

  async updateContact(id: string, body: object) {
    let where = this.getWhere();
    where = {
      id,
      deleted: false,
      ...this.getContextQuery(),
    };

    const foundContact = await Contact.findOne({ where });

    if (!foundContact) {
      throw new InvalidPayload('Contact not found');
    }

    const updatedContact = await Contact.update(body, { where });

    const newFoundContact = parseSequelizeResponse(foundContact);

    await this.feedLog.createOnDiff(
      {
        contact_id: foundContact.dataValues.id,
        type: 'updated',
        summary: 'Contact updated',
      },
      newFoundContact,
      body,
      {
        include: [
          'email_home',
          'email_mobile',
          'email_work',
          'email_other',
          'email_fax',
          'phone_home',
          'phone_mobile',
          'phone_work',
          'phone_other',
          'phone_fax',
        ],
        generateSummary: this.getSummary,
      }
    );

    return updatedContact;
  }

  async getContactAndOrganization(contact_id: string, organization_id: string) {
    const organizationService = organizationServiceFactory(this.user);
    const [foundContact, foundOrganization] = await Promise.all([
      Contact.findByPk(contact_id),
      organizationService.getOrganizationById(organization_id),
    ]);

    if (!foundContact) {
      throw new InvalidPayload('Contact not found');
    }

    if (!foundOrganization) {
      throw new InvalidPayload('Organization not found');
    }

    return {
      foundContact,
      foundOrganization: foundOrganization,
    };
  }

  private async createLinkedFeed(
    contact: T['_attributes'],
    organization: OrganizationAttr
  ) {
    await Promise.all([
      this.feedLog.create({
        tenant_id: this.user.tenant,
        contact_id: contact.id,
        created_by: this.user.id,
        type: 'organizationLinked',
        summary: 'You are linked to the organization',
        object_data: organization,
      }),
      this.feedLog.create({
        tenant_id: this.user.tenant,
        organization_id: organization.id,
        created_by: this.user.id,
        type: 'contactLinked',
        summary: 'New contact linked',
        object_data: contact,
      }),
    ]);
  }

  async linkOrganization(contact_id: string, organization_id: string) {
    const { foundContact, foundOrganization } =
      await this.getContactAndOrganization(contact_id, organization_id);

    const updatedContact = await Contact.update(
      { organization_id },
      { where: { id: contact_id } }
    );

    await this.createLinkedFeed(foundContact, foundOrganization);

    return updatedContact;
  }

  async unlinkOrganization(contact_id: string, organization_id: string) {
    const { foundContact, foundOrganization } =
      await this.getContactAndOrganization(contact_id, organization_id);

    const updatedContact = await Contact.update(
      { organization_id: null },
      { where: { id: contact_id } }
    );

    const organizationGuestService = organizationGuestServiceFactory(this.user);

    await organizationGuestService.deleteGuest(contact_id, organization_id);

    await Promise.all([
      this.feedLog.create({
        tenant_id: this.user.tenant,
        contact_id,
        created_by: this.user.id,
        type: 'organizationUnlinked',
        summary: 'You are unlinked from the organization',
        object_data: foundOrganization,
      }),
      this.feedLog.create({
        tenant_id: this.user.tenant,
        organization_id,
        created_by: this.user.id,
        type: 'contactUnlinked',
        summary: 'Contact unlinked',
        object_data: foundContact,
      }),
    ]);

    return updatedContact;
  }

  async getContactsByOrganizationId({ organizationId, query }: any) {
    const { search, page = 1, limit = 5, ...restProps } = query || {};

    const querySearch = {
      ...restProps,
    };

    if (search) {
      const searchSplit = search.split(' ');

      if (searchSplit.length > 1) {
        querySearch[Op.and] = [
          {
            [Op.or]: [
              {
                first_name: {
                  [Op.iLike]: `%${searchSplit[0]} ${searchSplit[1]}%`,
                },
              },
              {
                last_name: {
                  [Op.iLike]: `%${searchSplit[0]} ${searchSplit[1]}%`,
                },
              },

              {
                [Op.and]: [
                  { first_name: { [Op.iLike]: `%${searchSplit[0]}%` } },
                  { last_name: { [Op.iLike]: `%${searchSplit[1]}%` } },
                ],
              },
            ],
          },
        ];
      } else {
        querySearch[Op.and] = [
          {
            [Op.or]: _.flatten(
              _.map(['first_name', 'last_name'], (item: string) => {
                return _.map(search.split(' '), (q: string) => {
                  return { [item]: { [Op.iLike]: `%${q}%` } };
                });
              })
            ),
          },
        ];
      }
    }

    const contacts = await Contact.findAndCountAll({
      attributes: [
        'id',
        'first_name',
        'last_name',
        'title',
        'avatar',
        'email_work',
        'organization_id',
        'phone_home',
        'phone_mobile',
        'phone_work',
        'phone_other',
        'phone_fax',
      ],
      where: {
        tenant_id: this.user.tenant,
        organization_id: organizationId,
        deleted: false,
        ...querySearch,
      },
      limit,
      offset: limit * (page - 1),
    });

    const dataCount = contacts.count;

    return {
      contacts: ParseSequelizeResponse(contacts.rows),
      pagination: {
        limit: Number(limit),
        page: Number(page),
        totalPages: Math.ceil(dataCount / limit),
        count: dataCount,
      },
    };
  }

  async createContact(data: ContactModifyAttributes) {
    const newContact = await Contact.create({
      id: uuidv4(),
      ...data,
    });

    let summary = 'Contact created';
    if (data.external_id) {
      summary = 'Contact imported';
    }
    await this.feedLog.create({
      tenant_id: this.user.tenant,
      contact_id: newContact.dataValues.id,
      created_by: newContact.dataValues.created_by,
      type: 'creation',
      summary,
      object_data: newContact,
    });

    if (data.organization_id) {
      const organizationService = organizationServiceFactory(this.user);
      const organization = await organizationService.getOrganizationById(
        data.organization_id
      );
      await this.createLinkedFeed(newContact, organization!);
    }

    return newContact;
  }

  async deleteOne(id: string) {
    const errorsFound = [];
    const contactFound = await Contact.findByPk(id);
    if (!contactFound) {
      throw new InvalidPayload('Contact not found');
    }

    if (contactFound.is_customer) {
      errorsFound.push(`This contact is an associated account.`);
    }

    const associatedDeals = await Deal.findAll({
      where: { contact_person_id: id },
    });

    if (associatedDeals.length) {
      errorsFound.push(`This contact is associated with one or more Deals.`);
    }

    const contactOwners = await ContactOwners.findAll({
      where: { contact_id: id },
    });

    if (contactOwners.length) {
      errorsFound.push(`This contact is associated with one or more owners.`);
    }

    if (errorsFound.length) {
      throw new InvalidPayload(errorsFound.join(','));
    }

    const totalDeleted = await sequelize.transaction(async (transaction) => {
      const followerService = followerFactory(this.user, 'contact');
      const feedService = feedServiceFactory(this.user);
      const feedFileService = feedFileServiceFactory(this.user);
      const noteService = noteServiceFactory(this.user);

      const sequelizeOpts = this.getSequelizeOpts({ transaction });
      await Promise.all([
        followerService.deleteByResourceId(id, sequelizeOpts),
        feedService.deleteByContactId(id, sequelizeOpts),
        feedFileService.deleteByContactId(id, sequelizeOpts),
        noteService.deleteByContactId(id, sequelizeOpts),
      ]);

      let where = this.getWhere();
      where = {
        id,
        ...this.getContextQuery('assigned_user_id'),
      };
      const [totalDeleted] = await Contact.update(
        { deleted: true },
        {
          ...sequelizeOpts,
          where,
        }
      );

      await this.feedLog.create({
        tenant_id: this.user.tenant,
        created_by: this.user.id,
        type: 'deletion',
        summary: 'Contact deleted',
        object_data: JSON.stringify(contactFound),
      });

      return totalDeleted;
    });

    return totalDeleted;
  }

  async getRelations(ids: Array<string>) {
    const [deals] = await Promise.all([
      Deal.findAll({
        where: {
          tenant_id: this.user.tenant,
          contact_person_id: { [Op.in]: ids },
        },
      }),
    ]);
    return {
      deals: deals.length,
    };
  }

  async getContactByExternalId(id: string) {
    return await Contact.findOne({
      where: { external_id: id, deleted: false, tenant_id: this.user.tenant },
    });
  }

  async getBasicInfo(id: string) {
    const contact = await Contact.findByPk(id, {
      attributes: ['id', 'first_name', 'last_name'],
    });

    return ParseSequelizeResponse(contact);
  }

  async validatePrimaryOwner(contactId: string) {
    const contact = await Contact.findOne({
      where: { id: contactId, assigned_user_id: this.user.id },
    });
    return !!contact;
  }

  async import(
    contacts: ImportContactAttributes[],
    opts: {
      updateExisting: boolean;
    }
  ) {
    const defaultData = {
      date_entered: new Date(),
      date_modified: new Date(),
      tenant_id: this.user.tenant,
      assigned_user_id: this.user.id,
      created_by: this.user.id,
      modified_user_id: this.user.id,
    };

    const organizations = contacts.reduce((acc, contact) => {
      if (contact.organization && !acc[contact.organization.name]) {
        acc[contact.organization.name] = contact.organization;
      }
      return acc;
    }, {} as { [K: string]: (OrganizationCreateDAO & { id?: string }) | null });

    await Promise.all(
      Object.entries(organizations).map(async ([name, data]) => {
        let organization = await Organization.findOne({
          attributes: ['id'],
          where: {
            name: Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('name')),
              name.toLowerCase()
            ),
            tenant_id: this.user.tenant,
          },
        });

        if (organization && organization.deleted) {
          await organization.update({ deleted: false });
        } else if (!organization) {
          organization = await Organization.create({
            ...data,
            ...defaultData,
            id: uuidv4(),
          });
        }
        organizations[name] = organization.dataValues;
      })
    );

    const upsertedContacts: { id: string }[] = [];
    const errors = await Promise.all(
      contacts.map(async (contact) => {
        const item = { ...contact, ...defaultData };
        let where;
        if (item.external_id) {
          where = {
            external_id: item.external_id,
            tenant_id: this.user.tenant,
          };
        } else if (item.email_work) {
          where = {
            email_work: Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('email_work')),
              item.email_work.toLowerCase()
            ),
            tenant_id: this.user.tenant,
          };
        } else if (item.first_name && item.last_name) {
          where = {
            first_name: Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('first_name')),
              item.first_name.toLowerCase()
            ),
            last_name: Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('last_name')),
              item.last_name.toLowerCase()
            ),
            tenant_id: this.user.tenant,
          };
        }

        let foundContact;
        if (Object.keys(where || {}).length > 0) {
          foundContact = await Contact.findOne({
            where,
          });
        }

        try {
          if (item.organization && organizations[item.organization.name]) {
            item.organization_id = organizations[item.organization.name]!.id!;
          }
          delete contact.organization;

          const contactId = foundContact ? foundContact.id : uuidv4();
          if (!foundContact) {
            await Contact.create({ ...item, id: contactId });
            upsertedContacts.push({
              id: contactId,
            });
            return;
          }

          if (foundContact.deleted) {
            await foundContact.update({ deleted: false });
          }
          if (opts.updateExisting) {
            await foundContact.update(item);
          }
          if (foundContact.deleted || opts.updateExisting) {
            upsertedContacts.push({
              id: contactId,
            });
          }
        } catch (error) {
          return item;
        }
      })
    );

    return {
      itemsFailed: errors.filter((error) => !!error),
      contacts: upsertedContacts,
    };
  }
}

export class AdminContactService extends ContactService {
  getContextQuery() {
    return {};
  }
}
export class OwnerContactService extends ContactService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export class UserContactService extends ContactService {
  getContextQuery(filterKey: 'created_by' | 'assigned_user_id' = 'created_by') {
    return {
      tenant_id: this.user.tenant,
      [filterKey]: this.user.id,
    };
  }
}

export class GuestContactService extends ContactService {
  getContextQuery() {
    return {};
  }

  private validate(organizationId: string) {
    if (
      this.user.jwt.scope !== 'guest' ||
      this.user.jwt.resource_access.organization[0].id !== organizationId
    ) {
      throw new Forbidden();
    }
  }

  async getContactsByOrganizationId({ organizationId, query }: any) {
    this.validate(organizationId);

    return super.getContactsByOrganizationId({ organizationId, query });
  }
}

export function contactServiceFactory(user: UserContext) {
  if (user?.auth?.isAdmin) {
    return new AdminContactService(Contact, user);
  } else if (user?.auth?.isOwner) {
    return new OwnerContactService(Contact, user);
  } else if (user?.jwt?.scope === 'guest') {
    return new GuestContactService(Contact, user);
  }

  return new UserContactService(Contact, user);
}
