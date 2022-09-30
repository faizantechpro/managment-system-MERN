import { StaticModel } from 'lib/database/helpers';
import { ContactModel } from 'lib/database/models/contacts';
import { DealsModel } from 'lib/database/models/deal';
import { OrganizationModel } from 'lib/database/models/organizations';
import { AuthUser } from 'lib/middlewares/auth';
import { Op } from 'sequelize';
import { ownerFactory } from '../owner';
import Base from './Base';
import ContextQuery from './ContextQuery';

export type OwnableModels = {
  contact: ContactModel;
  deal: DealsModel;
  organization: OrganizationModel;
};

export abstract class Ownable<
  T extends keyof OwnableModels,
  U extends OwnableModels[T],
  V extends StaticModel<U> = StaticModel<U>
> extends ContextQuery<U> {
  private type: T;
  private owner: ReturnType<typeof ownerFactory>;

  constructor(type: T, model: V, user: AuthUser) {
    super(model, user);

    this.type = type;
    this.owner = ownerFactory(this.user, type);
  }

  /**
   * Not all authenticated users make use of an owned filter.
   * Admin - can query all resources across all tenants
   * Owner - can query all resources in a single tenant
   * Guest - can query only from a single organization id
   */
  requiresOwnedFilter() {
    return (
      !this.user.auth.isAdmin &&
      !this.user.auth.isOwner &&
      !this.user.auth.isGuest
    );
  }

  /**
   * Retrieves a filter in order to return resources directly owned by the
   * user or as a secondary owner.
   */
  async getOwnedFilter(): Promise<ReturnType<Base<U>['getWhere']>> {
    if (!this.requiresOwnedFilter()) {
      return {};
    }

    const ownedResources = await this.getOwnedIds();

    let filter = this.getWhere();
    filter = {
      [Op.or]: [
        {
          id: {
            [Op.in]: ownedResources,
          },
        },
      ],
    };

    return filter;
  }

  /**
   * Retrieves a list of ids that the user directly owns or indirectly owns as
   * a secondary owner (through an "owner" pivot table)
   */
  async getOwnedIds() {
    if (!this.requiresOwnedFilter()) {
      return [];
    }

    const [ownedResources, secondaryOwnedResourceIds] = await Promise.all([
      this.model.findAll({
        where: {
          assigned_user_id: this.user.id,
        },
        attributes: ['id'],
      }),
      this.owner.getAllByResourceKey(),
    ]);

    const ownedResourceIds = ownedResources
      .map((ownedResource) => ownedResource.toJSON())
      .map((ownedResource) => ownedResource.id);

    return [...ownedResourceIds, ...secondaryOwnedResourceIds];
  }
}
