import { ContactOwnersModel } from 'lib/database/models/contactsOwners';
import { DealOwnersModel } from 'lib/database/models/deal';
import { OrganizationOwnersModel } from 'lib/database/models/organizationsOwners';
import { Pagination } from 'lib/types';
import {
  ResourceKey,
  ResourceKeyAssociation,
} from '../utils/ResourceKeyAssociation';

type OwnerModels =
  | ContactOwnersModel
  | OrganizationOwnersModel
  | DealOwnersModel;

export abstract class Owner<
  T extends Extract<keyof U['_attributes'], ResourceKey>,
  U extends OwnerModels
> extends ResourceKeyAssociation<T, U> {
  async getOwners(resourceId: string, pagination: Pagination, opts?: any) {
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

  /**
   * Returns all owned resources and only returns an array of strings filtered
   * down by resource key (e.g. contact_id, deal_id, organization_id)
   */
  async getAllByResourceKey() {
    const ownedResources = await this.model.findAll({
      where: {
        user_id: this.user.id,
      },
      attributes: [this.resourceKey],
    });

    return ownedResources
      .map((ownedResource) => ownedResource.toJSON())
      .map((ownedResource) => ownedResource[this.resourceKey]);
  }

  async getOwner(resourceId: string, userId: string) {
    const owner = await this.model.findOne({
      where: {
        [this.resourceKey]: resourceId,
        user_id: userId,
      },
    });

    return owner?.toJSON();
  }

  async addOwner(resourceId: string, userId: string) {
    // TODO this should be enforced through index
    const existingOwner = await this.getOwner(resourceId, userId);
    if (existingOwner) {
      throw new Error('owner already exists');
    }

    const owner = await this.model.create(
      {
        user_id: userId,
        [this.resourceKey]: resourceId,
      } as any,
      { returning: true }
    );

    return owner.toJSON();
  }

  async deleteOwner(resourceId: string, userId: string) {
    await this.model.destroy({
      where: {
        user_id: userId,
        [this.resourceKey]: resourceId,
      },
      limit: 1,
    });

    return;
  }
}
