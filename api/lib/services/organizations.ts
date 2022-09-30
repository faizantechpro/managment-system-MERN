import { Op, Sequelize, WhereOptions } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import { Diff, feedFileServiceFactory, feedServiceFactory } from './feed';
import {
  Organization,
  User,
  Contact,
  Deal,
  OrganizationOwners,
  sequelize,
} from '../database';
import ParseSequelizeResponse from '../utils/parseSequelizeResponse';
import {
  OrganizationModel,
  OrganizationModifyAttributes,
} from '../database/models/organizations';
import { Pagination } from 'lib/types';
import { ExpandModel, StaticModel } from 'lib/database/helpers';
import csv from 'lib/utils/csv';
import { AuthUser } from 'lib/middlewares/auth';
import { Ownable } from './utils/Ownable';
import { followerFactory } from './follower';
import { noteServiceFactory } from './note';
import { Forbidden, InvalidPayload } from 'lib/middlewares/exception';
import { Readable } from 'stream';

abstract class OrganizationService<
  T extends OrganizationModel = OrganizationModel,
  U extends StaticModel<T> = StaticModel<T>
> extends Ownable<'organization', T> {
  constructor(model: U, user: AuthUser) {
    super('organization', model, user);
  }

  async getOrganizations(
    pagination: Pagination,
    opts: {
      is_customer: boolean;
      cif: boolean;
      order: any;
    }
  ) {
    const { search, page, limit } = pagination;

    const { is_customer, cif, order, ...restProps } = opts;

    let querySearch = this.getWhere();
    querySearch = {
      ...restProps,
    };

    if (typeof cif === 'boolean') {
      querySearch[Op.or] = [
        { is_customer },
        {
          cif: {
            [Op.not]: '',
          },
        },
      ];
    }

    if (search) {
      querySearch = {
        ...restProps,
        name: { [Op.iLike]: `%${search}%` },
      };
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

    const sequelizeAlias = 'organizations';
    const organizations = await Organization.findAndCountAll({
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              select count(c.id) from contacts c where ${sequelizeAlias}.id = c.organization_id
            )`),
            'total_contacts',
          ],
          [
            Sequelize.literal(`(
              select count(d.id) from deals d where ${sequelizeAlias}.id = d.contact_organization_id and d.deal_type not in ('won', 'lost') and d.deleted = false
            )`),
            'total_open_deals',
          ],
          [
            Sequelize.literal(`(
              select count(d.id) from deals d where ${sequelizeAlias}.id = d.contact_organization_id and d.deal_type in ('won', 'lost') and d.deleted = false
            )`),
            'total_closed_deals',
          ],
        ],
      },
      include: [{ model: User, as: 'assigned_user' }, 'label'],
      where: {
        ...querySearch,
        deleted: false,
        ...ownedFilter,
        ...this.getContextQuery(),
      },
      limit,
      offset: limit * (page - 1),
      order: [queryOrder || ['date_modified', 'DESC']],
    });

    const dataCount = organizations.count;

    return {
      organizations: (
        organizations.rows as (ExpandModel<OrganizationModel> & {
          dataValues: {
            total_contacts: number;
            total_open_deals: number;
            total_closed_deals: number;
          };
        })[]
      ).map((row) => {
        row.dataValues.total_contacts = Number(row.dataValues.total_contacts);
        row.dataValues.total_open_deals = Number(
          row.dataValues.total_open_deals
        );
        row.dataValues.total_closed_deals = Number(
          row.dataValues.total_closed_deals
        );

        return row.dataValues;
      }),
      pagination: {
        limit: Number(limit),
        page: Number(page),
        totalPages: Math.ceil(dataCount / limit),
        count: dataCount,
      },
    };
  }

  getSummary(info: Diff[]) {
    if (info.length === 1) {
      const key = info[0].key;

      if (key.includes('address')) {
        return `Address updated`;
      } else if (key.includes('industry')) {
        return `Industry updated`;
      } else if (key.includes('status')) {
        return `Status updated`;
      }
    }
  }

  async updateOrganization(id: string, body: any) {
    const foundOrganization = await Organization.findByPk(id);

    if (!foundOrganization) {
      throw new InvalidPayload('Organization not found');
    }

    const where: WhereOptions = { id, ...this.getContextQuery() };

    const updatedOrganization = await Organization.update(body, { where });
    const newFoundOrganization = ParseSequelizeResponse(foundOrganization);

    await this.feedLog.createOnDiff(
      {
        organization_id: foundOrganization.dataValues.id,
        type: 'updated',
        summary: 'Organization updated',
      },
      newFoundOrganization,
      body,
      {
        include: [
          'name',
          'address_street',
          'address_city',
          'address_state',
          'address_postalcode',
          'address_country',
          'industry',
          'status',
        ],
        generateSummary: this.getSummary,
        parseAddress: true,
      }
    );

    return updatedOrganization;
  }

  async createOrganization(data: OrganizationModifyAttributes) {
    const newOrganization = await Organization.create({
      id: uuidv4(),
      ...data,
      tenant_id: this.user.tenant,
    });

    let summary = 'Organization created';
    if (data.external_id) {
      summary = 'Organization imported';
    }

    await this.feedLog.create({
      tenant_id: this.user.tenant,
      organization_id: newOrganization.dataValues.id,
      created_by: newOrganization.dataValues.created_by,
      type: 'creation',
      summary,
      object_data: newOrganization,
    });

    return newOrganization.dataValues;
  }

  async getOrganizationById(id: string) {
    const ownedFilter = await this.getOwnedFilter();

    const organization = await Organization.findOne({
      where: {
        id,
        deleted: false,
        ...ownedFilter,
      },
      include: ['assigned_user', 'label'],
    });

    return organization?.toJSON();
  }

  async getOrganizationByExternalId(id: string) {
    const organization = await Organization.findOne({
      where: { external_id: id, tenant_id: this.user.tenant },
    });

    return organization?.toJSON();
  }

  async getByAvatarId(avatarId: string) {
    const organization = await this.model.findOne({
      where: {
        avatar: avatarId,
      },
    });

    return organization?.toJSON();
  }

  async deleteOne(id: string) {
    const organization = await Organization.findByPk(id);
    const errorsFound = [];

    if (!organization) {
      throw new InvalidPayload('Organization not found');
    }

    const isCustomer = await Organization.findOne({
      where: { id: id, is_customer: true },
    });

    if (isCustomer) {
      errorsFound.push(`This organization is an associated account.`);
    }

    const associatedContacts = await Contact.findAll({
      where: {
        organization_id: id,
        tenant_id: this.user.tenant,
        deleted: false,
      },
    });

    if (associatedContacts.length) {
      const associatedContactIds = associatedContacts.map(
        (associatedContact) => associatedContact.id
      );

      await Contact.update(
        {
          deleted: true,
        },
        {
          where: {
            id: associatedContactIds,
          },
        }
      );
    }

    const associatedDeals = await Deal.findAll({
      where: { contact_organization_id: id, deleted: false },
    });

    if (associatedDeals.length) {
      errorsFound.push(
        `This organization is associated with one or more Deals.`
      );
    }

    const associatedOwners = await OrganizationOwners.findAll({
      where: { organization_id: id },
    });

    if (associatedOwners.length) {
      errorsFound.push(
        `This organization is associated with one or more owners.`
      );
    }

    if (errorsFound.length) {
      throw new InvalidPayload(errorsFound.join(','));
    }

    const totalDeleted = await sequelize.transaction(async (transaction) => {
      const followerService = followerFactory(this.user, 'organization');
      const feedService = feedServiceFactory(this.user);
      const feedFileService = feedFileServiceFactory(this.user);
      const noteService = noteServiceFactory(this.user);

      const sequelizeOpts = this.getSequelizeOpts({ transaction });
      await Promise.all([
        followerService.deleteByResourceId(id, sequelizeOpts),
        feedService.deleteByOrganizationId(id, sequelizeOpts),
        feedFileService.deleteByOrganizationId(id, sequelizeOpts),
        noteService.deleteByOrganizationId(id, sequelizeOpts),
      ]);

      const [totalDeleted] = await Organization.update(
        { deleted: true },
        {
          ...sequelizeOpts,
          where: { id, tenant_id: this.user.tenant },
        }
      );

      await this.feedLog.create({
        tenant_id: this.user.tenant,
        created_by: this.user.id,
        type: 'deletion',
        summary: 'Organization deleted',
        object_data: organization,
      });

      return totalDeleted;
    });

    return totalDeleted;
  }

  async getRelations(ids: Array<string>) {
    const [contacts, deals] = await Promise.all([
      Contact.findAll({
        where: {
          organization_id: { [Op.in]: ids },
          tenant_id: this.user.tenant,
        },
      }),
      Deal.findAll({
        where: {
          tenant_id: this.user.tenant,
          contact_organization_id: { [Op.in]: ids },
        },
      }),
    ]);
    return {
      contacts: contacts.length,
      deals: deals.length,
    };
  }

  async getBasicInfo(id: string) {
    const organization = await Organization.findByPk(id, {
      attributes: ['id', 'name'],
    });

    return ParseSequelizeResponse(organization);
  }

  async validatePrimaryOwner(organizationId: string) {
    const organization = await Organization.findOne({
      where: { id: organizationId, assigned_user_id: this.user.id },
    });
    return !!organization;
  }

  async import(csvFile: any, updateExisting: string) {
    const importLimit = 1000;
    let importFailedItems: any[] = [];
    const data = await csv.parser(
      Readable.from(csvFile.buffer.toString('utf-8')),
      { delimiter: ',', columns: true }
    );
    const totalItems = data.length;

    if (data.length > importLimit) {
      importFailedItems = data.slice(importLimit);
    }

    await Promise.all(
      data.splice(0, importLimit).map(async (item: any) => {
        if (!item.name) {
          return importFailedItems.push(item);
        }

        const toInsert = {
          name: item.name,
          naics_code: item.naics_code || null,
          industry: item.industry || null,
          address_street: item.address_street || null,
          address_city: item.address_city || null,
          address_state: item.address_state || null,
          address_postal_code: item.address_postal_code || null,
          address_country: item.address_country || null,
          branch: item.branch || null,
          employees: item.employees || null,
          total_revenue: item.total_revenue || null,

          date_entered: new Date(),
          date_modified: new Date(),
          tenant_id: this.user.tenant,
          assigned_user_id: this.user.id,
          created_by: this.user.id,
          modified_user_id: this.user.id,
        };

        const foundOrg = await Organization.findOne({
          where: {
            name: Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('name')),
              item.name.toLowerCase()
            ),
            tenant_id: this.user.tenant,
          },
        });

        try {
          if (!foundOrg) {
            await Organization.create({ ...toInsert, id: uuidv4() });
            return;
          }

          const shouldUpdate = updateExisting === 'true';
          if (shouldUpdate) {
            await foundOrg.update(toInsert);
          }
          if (foundOrg.deleted) {
            await foundOrg.update({ deleted: false });
          }
          if (shouldUpdate || foundOrg.deleted) {
            return;
          }
          importFailedItems.push(item);
        } catch (error) {
          importFailedItems.push(item);
        }
      })
    );

    return {
      itemsFailed: importFailedItems,
      totalItems,
    };
  }
}

export class AdminOrganizationService extends OrganizationService {
  getContextQuery() {
    return {};
  }
}

export class OwnerOrganizationService extends OrganizationService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export class UserOrganizationService extends OrganizationService {
  getContextQuery(filterKey: 'created_by' | 'assigned_user_id' = 'created_by') {
    return {
      tenant_id: this.user.tenant,
      [filterKey]: this.user.id,
    };
  }
}

export class GuestOrganizationService extends OrganizationService {
  getContextQuery() {
    if (this.user.jwt.scope !== 'guest') {
      throw new Error('invalid context');
    }
    return {
      id: this.user.jwt.resource_access.organization[0].id,
    };
  }

  private validate(organizationId: string) {
    if (
      this.user.jwt.scope !== 'guest' ||
      this.user.jwt.resource_access.organization[0].id !== organizationId
    ) {
      throw new Forbidden();
    }
  }

  async getOrganizationById(organizationId: string) {
    this.validate(organizationId);

    return super.getOrganizationById(organizationId);
  }
}

export function organizationServiceFactory(user: AuthUser) {
  if (user?.auth?.isAdmin) {
    return new AdminOrganizationService(Organization, user);
  } else if (user?.auth?.isOwner) {
    return new OwnerOrganizationService(Organization, user);
  } else if (user?.jwt?.scope === 'guest') {
    return new GuestOrganizationService(Organization, user);
  }

  return new UserOrganizationService(Organization, user);
}
