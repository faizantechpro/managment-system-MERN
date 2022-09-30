import { ContactFollowersModel } from 'lib/database/models/contactsFollowers';
import { DealFollowersModel } from 'lib/database/models/deal';
import { OrganizationFollowersModel } from 'lib/database/models/organizationsFollowers';
import { Pagination } from 'lib/types';
import { SequelizeOpts } from '../utils/Base';
import {
  ResourceKey,
  ResourceKeyAssociation,
} from '../utils/ResourceKeyAssociation';

type FollowerModels =
  | ContactFollowersModel
  | OrganizationFollowersModel
  | DealFollowersModel;

export abstract class Follower<
  T extends Extract<keyof U['_attributes'], ResourceKey>,
  U extends FollowerModels
> extends ResourceKeyAssociation<T, U> {
  async getFollowers(resourceId: string, pagination: Pagination, opts?: any) {
    const { page = 1, limit = 10 } = pagination;

    const { rows, count } = await this.model.findAndCountAll({
      where: {
        [this.resourceKey]: resourceId,
        ...opts,
      },
      include: ['user'],
      limit,
      offset: limit * (page - 1),
    });

    return this.getPaginatedResponse(rows, count, pagination);
  }

  async isFollower(resourceId: string, userId: string) {
    const follower = await this.model.findOne({
      where: {
        user_id: userId,
        [this.resourceKey]: resourceId,
      },
    });

    return !!follower?.toJSON();
  }

  async startFollowing(resourceId: string, userId: string) {
    const follower = await this.model.create(
      {
        user_id: userId,
        [this.resourceKey]: resourceId,
      } as any,
      { returning: true }
    );

    return follower.toJSON();
  }

  async stopFollowing(resourceId: string, userId: string) {
    await this.model.destroy({
      where: {
        user_id: userId,
        [this.resourceKey]: resourceId,
      },
      limit: 1,
    });

    return;
  }

  async deleteByResourceId(resourceId: string, opts: SequelizeOpts = {}) {
    const deleted = await this.model.destroy({
      where: {
        [this.resourceKey]: resourceId,
      } as any,
      ...this.getSequelizeOpts(opts),
    });

    return deleted;
  }
}
