import { Op, fn, col, Sequelize, WhereOptions } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import {
  Deal,
  DealOwners,
  Organization,
  sequelize,
  TenantDealStage,
} from '../../database';
import { DealsModel, DealsModifyAttributes } from '../../database/models/deal';
import ParseSequelizeResponse from 'lib/utils/parseSequelizeResponse';
import { emitAppEvent } from 'lib/middlewares/emitter';
import { StaticModel } from 'lib/database/helpers';
import { AuthUser } from 'lib/middlewares/auth';
import { Ownable } from '../utils/Ownable';
import { dealProductServiceFactory } from './dealProduct';
import { followerFactory } from '../follower';
import { ownerFactory } from '../owner';
import { InvalidPayload } from 'lib/middlewares/exception';
import { Diff, feedFileServiceFactory, feedServiceFactory } from '../feed';
import { noteServiceFactory } from '../note';

interface IQueryDeals {
  start_date?: Date;
  end_date?: Date;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  assigned_user_id?: string;
  deal_type?: string;
  order?: any;
  [Op.or]?: [
    {
      name?: {
        [Op.iLike]?: string;
      };
    },
    { '$organization.name$': { [Op.iLike]: string } }
  ];
}

type IUpdatePosition = {
  type: string;
  position: number;
  tenant_deal_stage_id: string;
  limit: number;
  destination?: boolean;
  origin?: number;
};

type ContactAndOrg = {
  contact_id?: string;
  organization_id?: string;
};

abstract class DealsService<
  T extends DealsModel = DealsModel,
  U extends StaticModel<T> = StaticModel<T>
> extends Ownable<'deal', T> {
  private dealProductService: ReturnType<typeof dealProductServiceFactory>;

  constructor(model: U, user: AuthUser) {
    super('deal', model, user);

    this.dealProductService = dealProductServiceFactory(user);
  }

  async getDeals(query: IQueryDeals) {
    const {
      start_date,
      end_date,
      status,
      search,
      page = 1,
      order,
      limit = 10,
      ...restProps
    } = query || {};

    const ownedFilter = await this.getOwnedFilter();

    let searchQuery = {};
    if (search) {
      searchQuery = {
        [Op.and]: [
          {
            [Op.or]: [
              { name: { [Op.iLike]: `%${search}%` } },
              {
                '$organization.name$': {
                  [Op.iLike]: `%${search}%`,
                },
              },
            ],
          },
        ],
      };
    }

    let where: WhereOptions = {
      ...ownedFilter,
    };

    if (start_date && end_date) {
      where.date_entered = {
        [Op.and]: {
          [Op.gte]: start_date,
          [Op.lte]: end_date,
        },
      };
    } else if (status) {
      if (['won', 'lost'].includes(status)) {
        where.status = status;
      } else if (status === 'deleted') {
        where.deleted = true;
      } else if (status === 'opened') {
        where.status = null;
        where.deleted = false;
      } else if (status === 'closed') {
        where = {
          [Op.or]: { status: { [Op.in]: ['won', 'lost'] }, deleted: true },
          ...where,
        };
      }
    } else {
      where.deleted = false;
    }

    const deals = await Deal.findAndCountAll({
      include: [
        'assigned_user',
        'contact',
        'organization',
        {
          model: TenantDealStage,
          as: 'tenant_deal_stage',
          include: ['deal_stage'],
        },
      ],
      where: {
        ...restProps,
        ...searchQuery,
        ...where,
      },
      limit,
      offset: limit * (page - 1),
      order: [order || ['position', 'ASC'], ['date_modified', 'DESC']],
    });

    const dataCount = deals.count;

    return {
      deals: deals.rows,
      pagination: {
        limit: Number(limit),
        page: Number(page),
        totalPages: Math.ceil(dataCount / limit),
        count: dataCount,
      },
    };
  }

  async getOverall() {
    const result = await Deal.findAndCountAll({
      attributes: [[fn('sum', col('amount')), 'overall']],
      where: {
        ...this.getContextQuery(),
      },
    });

    return result?.rows[0];
  }

  async getDealById(id: string) {
    const ownedFilter = await this.getOwnedFilter();

    const dealProducts = await this.dealProductService.getByDealId(id);

    const deal = await Deal.findOne({
      include: [
        'assigned_user',
        'contact',
        {
          model: Organization,
          as: 'organization',
          include: ['label'],
        },
      ],
      where: {
        id,
        ...ownedFilter,
      },
    });

    return { deal, deal_products: dealProducts };
  }

  async createDeal(data: DealsModifyAttributes) {
    const { contact_organization_id } = data || {};

    if (!contact_organization_id) {
      throw new InvalidPayload('Bad Request');
    }
    const newDeal = await Deal.create({ id: uuidv4(), ...data });

    const contactAndOrgIds: ContactAndOrg = {};
    if (newDeal?.contact_person_id) {
      contactAndOrgIds.contact_id = newDeal.contact_person_id;
    }
    if (newDeal?.contact_organization_id) {
      contactAndOrgIds.organization_id = newDeal.contact_organization_id;
    }

    await this.feedLog.create({
      tenant_id: String(data.tenant_id),
      deal_id: newDeal.id,
      ...contactAndOrgIds,
      created_by: newDeal.created_by,
      type: 'creation',
      summary: 'Deal created',
      object_data: newDeal,
    });

    return newDeal.toJSON();
  }

  async deleteOne(id: string) {
    let where = this.getWhere();
    where = {
      id,
      ...this.getContextQuery(),
    };

    const ownerService = ownerFactory(this.user, 'deal');
    const {
      pagination: { count: totalOwners },
    } = await ownerService.getOwners(id, {
      limit: 1,
      page: 1,
    });
    if (totalOwners > 0) {
      throw new InvalidPayload(
        'This deal is associated with one or more owners.'
      );
    }

    const totalDeleted = await sequelize.transaction(async (transaction) => {
      // TODO revisit this. this feels sloppy and is only for activity stream
      const deal = await this.getDealById(id);

      const followerService = followerFactory(this.user, 'deal');
      const feedService = feedServiceFactory(this.user);
      const feedFileService = feedFileServiceFactory(this.user);
      const noteService = noteServiceFactory(this.user);

      const sequelizeOpts = this.getSequelizeOpts({ transaction });

      await Promise.all([
        this.dealProductService.deleteByDealId(id, sequelizeOpts),
        followerService.deleteByResourceId(id, sequelizeOpts),
        feedService.deleteByDealId(id, sequelizeOpts),
        feedFileService.deleteByDealId(id, sequelizeOpts),
        noteService.deleteByDealId(id, sequelizeOpts),
      ]);
      const [totalDeleted] = await Deal.update(
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
        summary: 'Deal deleted',
        object_data: JSON.stringify(deal.deal),
      });

      return totalDeleted;
    });
    return totalDeleted;
  }

  getSummary(info: Array<Diff>): string {
    let summary = 'Deal updated';
    if (info.length === 1) {
      const key = info[0].key;

      if (key.includes('amount')) {
        summary = `Value updated`;
      } else if (key.includes('stage_name')) {
        summary = `Status updated`;
      }
    }

    return summary;
  }

  async updateOne(id: string, data: any) {
    const foundDeal = await Deal.findByPk(id, {
      include: [
        {
          model: TenantDealStage,
          as: 'tenant_deal_stage',
          include: ['deal_stage'],
        },
      ],
    });

    if (!foundDeal) {
      throw new InvalidPayload('Deal not found');
    }

    const secondaryOwners = await DealOwners.findAll({
      where: { user_id: this.user.id },
    });

    const queryDealsByUserOrOwner = secondaryOwners.map((secondaryOwner) => {
      return { id: secondaryOwner.dataValues.deal_id };
    }) as any;

    queryDealsByUserOrOwner.push({
      assigned_user_id:
        this.user.auth.isAdmin || this.user.auth.isOwner
          ? { [Op.not]: null }
          : this.user.id,
    });

    const deal = await Deal.update(
      {
        ...data,
        date_modified: new Date(),
      },
      {
        where: {
          id,
          [Op.or]: queryDealsByUserOrOwner,
        },
      }
    );

    const newFoundDeal = ParseSequelizeResponse(foundDeal);
    newFoundDeal.stage_name = newFoundDeal?.tenant_deal_stage?.deal_stage.name;

    const diff = await this.feedLog.getUpdateDiff(newFoundDeal, data, {
      include: ['amount', 'stage_name', 'name'],
    });

    if (diff.length > 0) {
      const contactId = data?.contact_person_id || foundDeal?.contact_person_id;
      const organizationId =
        data?.contact_organization_id || foundDeal?.contact_organization_id;
      const dealName = data?.name || foundDeal?.name;

      const contactAndOrg: ContactAndOrg = {};

      if (contactId) {
        contactAndOrg.contact_id = contactId;
      }
      if (organizationId) {
        contactAndOrg.organization_id = organizationId;
      }

      const activityFeed = await this.feedLog.create({
        tenant_id: this.user.tenant,
        deal_id: foundDeal.id,
        ...contactAndOrg,
        created_by: this.user.id,
        type: 'updated',
        summary: this.getSummary(diff),
        object_data: { updates: diff, name: dealName },
      });

      await emitAppEvent({
        event: 'DEAL_UPDATED',
        resource: 'deals',
        resource_id: newFoundDeal.id,
        payload: {
          deal: newFoundDeal,
          feed: activityFeed,
          user: this.user,
        },
      });
    }

    return deal;
  }

  async getBasicInfo(id: string) {
    const deal = await Deal.findByPk(id, {
      attributes: ['id', 'name'],
    });

    return ParseSequelizeResponse(deal);
  }

  async getAdditionalOwnerInfo(id: string) {
    const dealOwners = await DealOwners.findAll({
      where: { deal_id: id },
      include: ['user'],
    });
    return ParseSequelizeResponse(dealOwners);
  }

  async validatePrimaryOwner(dealId: string) {
    const deal = await Deal.findOne({
      where: { id: dealId, assigned_user_id: this.user.id },
    });
    return !!deal;
  }

  async updatePositionDeals(
    id: string,
    update_deal: Array<IUpdatePosition>,
    body: any
  ) {
    const secondaryOwners = await DealOwners.findAll({
      where: { user_id: this.user.id },
    });

    const queryDealsByUserOrOwner = secondaryOwners.map((secondaryOwner) => {
      return { id: secondaryOwner.dataValues.deal_id };
    }) as any;

    queryDealsByUserOrOwner.push({
      assigned_user_id: this.user.auth.isAdmin
        ? { [Op.not]: null }
        : this.user.id,
    });

    let querySearch: any = {
      deleted: false,
    };

    if (queryDealsByUserOrOwner.length)
      querySearch = { ...querySearch, [Op.or]: queryDealsByUserOrOwner };

    if (update_deal.length == 2) {
      await this.updatePositionBetweenColumns(id, update_deal, querySearch);
      const { tenant_deal_stage_id, stage_name } = body;
      await this.updateOne(id, { tenant_deal_stage_id, stage_name });
    } else
      await this.updatePositionBetweenRows(id, update_deal[0], querySearch);
  }

  async updatePositionBetweenColumns(
    id: string,
    update_deal: Array<IUpdatePosition>,
    querySearch: any
  ) {
    await Promise.all(
      update_deal?.map(async (item) => {
        const deals = await Deal.findAndCountAll({
          where: {
            tenant_deal_stage_id: item.tenant_deal_stage_id,
            tenant_id: this.user.tenant,
            ...querySearch,
          },
          limit: item.limit,
          order: [
            ['position', 'ASC'],
            ['date_modified', 'DESC'],
          ],
        });

        let position: number | null = null;
        await Promise.all(
          deals?.rows?.map(async (deal: any, index: number) => {
            if (index >= item.position && deal.id !== id) {
              position = item.destination ? index + 1 : index;
            } else if (deal.id !== id) {
              position = index;
            }
            if (position) {
              await Deal.update(
                {
                  position,
                  date_modified: new Date(),
                },
                {
                  where: {
                    tenant_id: this.user.tenant,
                    id: deal.id,
                  },
                }
              );
            }
            if (index === deals.rows.length - 1 && item.destination) {
              await Deal.update(
                {
                  position: item.position,
                  date_modified: new Date(),
                },
                {
                  where: {
                    tenant_id: this.user.tenant,
                    id,
                  },
                }
              );
            }
          })
        );
      })
    );
  }

  async updatePositionBetweenRows(
    id: string,
    update_deal: IUpdatePosition,
    querySearch: any
  ) {
    const deals = await Deal.findAndCountAll({
      where: {
        tenant_deal_stage_id: update_deal.tenant_deal_stage_id,
        tenant_id: this.user.tenant,
        ...querySearch,
      },
      limit: update_deal.limit,
      order: [
        ['position', 'ASC'],
        ['date_modified', 'DESC'],
      ],
    });

    let position = null;
    await Promise.all(
      deals?.rows?.map(async (deal: any, index: number) => {
        if (
          index >= update_deal.position &&
          index < Number(update_deal.origin)
        ) {
          position = index + 1;
          await Deal.update(
            {
              position,
              date_modified: new Date(),
            },
            {
              where: {
                tenant_id: this.user.tenant,
                id: deal.id,
              },
            }
          );
        }
        if (index === update_deal.origin) {
          await Deal.update(
            {
              tenant_deal_stage_id: update_deal.tenant_deal_stage_id,
              position: update_deal.position,
              date_modified: new Date(),
            },
            {
              where: {
                tenant_id: this.user.tenant,
                id,
              },
            }
          );
        }
      })
    );
  }

  async getDealsStatus() {
    const statuses = await Deal.findAll({
      attributes: [
        'status',
        [Sequelize.fn('count', Sequelize.col('status')), 'count'],
        [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount'],
      ],
      group: ['status'],
      raw: true,
      where: {
        tenant_id: this.user.tenant,
      },
    });
    const deleted = await Deal.findAll({
      attributes: [
        'deleted',
        [Sequelize.fn('count', Sequelize.col('deleted')), 'count'],
        [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount'],
      ],
      group: ['deleted'],
      raw: true,
      where: {
        tenant_id: this.user.tenant,
      },
    });

    const won: any = statuses.find((status) => status.status == 'lost');
    const lost: any = statuses.find((status) => status.status === 'won');
    const del: any = deleted.find((d) => d.deleted);
    const newStatus = [];
    newStatus.push(
      won && Number(won.count) !== 0
        ? { id: 1, ...won }
        : { id: 1, status: 'lost', count: '0', total_amount: '0' }
    );
    newStatus.push(
      lost && Number(lost.count) !== 0
        ? { id: 2, ...lost }
        : { id: 2, status: 'won', count: '0', total_amount: '0' }
    );
    newStatus.push(
      del
        ? { id: 3, status: 'delete', ...del }
        : { id: 3, status: 'delete', count: '0', total_amount: '0' }
    );

    return newStatus;
  }

  async setDealStatus(id: string, status: string) {
    const statuses = ['won', 'lost'];
    if (statuses.includes(status)) {
      await Deal.update(
        { status: status as 'won' | 'lost' },
        {
          where: { id },
        }
      );
    } else if (status === 'delete') {
      await Deal.update(
        { deleted: true },
        {
          where: { id },
        }
      );
    }
  }

  async updateDealsStages(data: any) {
    const bulkCreate = await Deal.bulkCreate(data, {
      updateOnDuplicate: ['id', 'tenant_deal_stage_id'],
    });
    const dealsData = bulkCreate.map((deal) => deal.toJSON());
    return dealsData;
  }

  async findByTenantDealStageID(tenant_deal_stage_id: string) {
    const tenantDealStages = await this.model.findAll({
      where: {
        ...this.getContextQuery(),
        tenant_deal_stage_id,
        tenant_id: this.user.tenant,
      },
    });
    return this.rowsToJSON(tenantDealStages);
  }
}

export class AdminDealService extends DealsService {
  getContextQuery() {
    return {};
  }
}

export class OwnerDealService extends DealsService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export class UserDealService extends DealsService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
      assigned_user_id: this.user.id,
    };
  }
}

export function dealServiceFactory(user: AuthUser) {
  if (user?.auth?.isAdmin) {
    return new AdminDealService(Deal, user);
  } else if (user?.auth?.isOwner) {
    return new OwnerDealService(Deal, user);
  } else {
    return new UserDealService(Deal, user);
  }
}
