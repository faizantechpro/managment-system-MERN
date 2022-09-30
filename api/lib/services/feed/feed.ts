import { Model, Op, Sequelize } from 'sequelize';

import { Activities, Feed } from '../../database';
import { FeedModel } from '../../database/models/feed';
import { ExpandModel } from 'lib/database/helpers';
import { organizationServiceFactory } from '../organizations';
import { dealServiceFactory } from '../deal';
import { contactServiceFactory } from '../contacts';
import Base, { SequelizeOpts } from '../utils/Base';
import { AuthUser } from 'lib/middlewares/auth';
import { feedCommentServiceFactory } from './feedComment';
import { activityServiceFactory } from '../activities';

abstract class FeedService extends Base<FeedModel> {
  async getActivityFeed({
    contactId,
    organizationId,
    dealId,
    userId,
    limit = 15,
    page = 1,
    ...restProps
  }: any) {
    const {
      auth: { isAdmin, isOwner },
    } = this.user;

    const {
      type,
      done,
      contacts,
      noPlaned,
      orderBy = 'created_on',
      typeOrder = 'DESC',
    } = restProps;

    let where = this.getWhere();

    if (contactId) {
      where.contact_id = contactId;
    }

    if (organizationId) {
      where.organization_id = organizationId;

      if (contacts?.length) {
        where.created_by = {
          [Op.in]: contacts,
        };
      }
    }

    if (dealId) {
      where.deal_id = dealId;
    }

    if (userId) {
      where.created_by = userId;
    }

    if (type) {
      where.type = {
        [Op.in]: type,
      };
    }

    if (!type && noPlaned) {
      where.object_data = {
        done: { [Op.not]: false },
      };
    }

    where.object_data = {
      deleted_on: null,
    };

    if (done) {
      where.object_data = {
        ...where.object_data,
        done: done === 'true',
      };
    }

    // TODO possible ownable service???
    if (!isAdmin && !isOwner && !organizationId && !contactId && !dealId) {
      const contact = contactServiceFactory(this.user);
      const deal = dealServiceFactory(this.user);
      const organization = organizationServiceFactory(this.user);

      const [organizationsOwned, contactsOwned, dealsOwned] = await Promise.all(
        [organization.getOwnedIds(), contact.getOwnedIds(), deal.getOwnedIds()]
      );

      const ownedFilter = {
        [Op.or]: [
          {
            contact_id: {
              [Op.in]: contactsOwned,
            },
          },
          {
            organization_id: {
              [Op.in]: organizationsOwned,
            },
          },
          {
            deal_id: {
              [Op.in]: dealsOwned,
            },
          },
          {
            created_by: this.user.id,
          },
        ],
      };

      where = { ...where, ...ownedFilter, tenant_id: this.user.tenant };
    } else if (isOwner) {
      where.tenant_id = this.user.tenant;
    }

    const data = await Feed.findAndCountAll({
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              select count(c.id) from comments c where feed.id = c.feed_id
            )`),
            'total_comments',
          ],
          [
            Sequelize.literal(`(
              select a.id from activities a where feed.id = a.feed_id
            )`),
            'activity_id',
          ],
        ],
      },
      where,
      limit,
      offset: limit * (page - 1),
      include: [
        'created_by_info',
        'updated_by_info',
        'deal',
        'contact',
        'organization',
      ],
      distinct: true,
      order: [[orderBy, typeOrder]],
    });

    return {
      feed: (
        data.rows as ExpandModel<
          FeedModel & Model<{ total_comments: number }>
        >[]
      ).map((row) => {
        row.dataValues.total_comments = Number(row.dataValues.total_comments);
        return row;
      }),
      pagination: {
        limit: Number(limit),
        page: Number(page),
        totalPages: Math.ceil(data.count / limit),
        count: data.count,
      },
    };
  }

  async getOne(id: string) {
    const feed = await this.model.findByPk(id);
    return feed?.toJSON();
  }

  async getNumberTypes(
    { contactId, organizationId, dealId }: any,
    types: any[]
  ) {
    const where = this.getWhere();
    where.tenant_id = this.user.tenant;

    if (contactId) {
      where.contact_id = contactId;
    }

    if (organizationId) {
      where.organization_id = organizationId;
    }

    if (dealId) {
      where.deal_id = dealId;
    }

    const result = [];
    for (const { type, label } of types) {
      if (type) {
        where.type = { [Op.in]: type };
      } else {
        where.object_data = {
          done: { [Op.not]: false },
        };
      }

      const count = await Feed.count({
        where,
      });

      result.push({ count, label });
    }

    return result;
  }

  async getSingleActivityFeed(activityId: string) {
    const where = this.getWhere();

    const orderBy = 'created_on';
    const typeOrder = 'DESC';

    const data = await Feed.findOne({
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              select count(c.id) from comments c where feed.id = c.feed_id
            )`),
            'total_comments',
          ],
        ],
      },
      where,
      include: [
        'created_by_info',
        'updated_by_info',
        'deal',
        'contact',
        'organization',
        {
          model: Activities,
          required: true,
          attributes: [['id', 'activity_id']],
          where: {
            id: activityId,
          },
        },
      ],

      order: [[orderBy, typeOrder]],
    });

    const feedData = data as ExpandModel<
      FeedModel & Model<{ total_comments: number }>
    >;
    if (feedData)
      feedData.dataValues.total_comments = Number(
        feedData?.dataValues.total_comments
      );

    return feedData.toJSON();
  }

  async findByObjectDataId(id: string) {
    const where = this.getWhere();
    where.object_data = {
      id,
      deleted_on: null,
    };

    const feed = await this.model.findOne({
      where,
    });

    return feed?.toJSON();
  }

  /**
   * For now, deletes only remove child associations
   */

  async deleteByContactId(contactId: string, opts: SequelizeOpts = {}) {
    return this.deleteByResourceId('contact_id', contactId, opts);
  }
  async deleteByDealId(dealId: string, opts: SequelizeOpts = {}) {
    return this.deleteByResourceId('deal_id', dealId, opts);
  }
  async deleteByOrganizationId(
    organizationId: string,
    opts: SequelizeOpts = {}
  ) {
    return this.deleteByResourceId('organization_id', organizationId, opts);
  }
  async deleteByResourceId(
    resourceKey: 'contact_id' | 'deal_id' | 'organization_id',
    id: string,
    opts: SequelizeOpts = {}
  ) {
    const feedIds = await this.model.findAll({
      where: {
        [resourceKey]: id,
      },
      attributes: ['id'],
    });

    await Promise.all(feedIds.map(({ id }) => this.deleteOne(id, opts)));
  }

  async deleteOne(id: string, opts: SequelizeOpts = {}) {
    const feedCommentService = feedCommentServiceFactory(this.user);
    const activityService = activityServiceFactory(this.user);

    await Promise.all([
      feedCommentService.deleteByFeedId(id, opts),
      activityService.deleteByFeedId(id, opts),
    ]);
  }
}

class AdminFeedService extends FeedService {
  getContextQuery() {
    return {};
  }
}

class UserFeedService extends FeedService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export function feedServiceFactory(user: AuthUser) {
  if (user.auth.isAdmin) {
    return new AdminFeedService(Feed, user);
  }
  return new UserFeedService(Feed, user);
}
