import { StaticModel } from 'lib/database/helpers';
import { AuthUser } from 'lib/middlewares/auth';
import { Model } from 'sequelize';
import BaseLog from './BaseLog';

export type ResourceType = 'contact' | 'deal' | 'organization';

/**
 * This class is intended to be the base class for associating a resource by
 * using a "type" field as a way to differentiate between resources.
 *
 * For example: Fields are created globally for contacts or organizations. All
 * fields are stored in the same table but finding custom fields for a contact
 * is achieved by querying by the "type" column with "contact"
 *
 * Although similar, do not confuse this class with ResourceKeyAssociation
 */
export abstract class ResourceTypeAssociation<
  T extends ResourceType,
  U extends Model,
  V extends StaticModel<U> = StaticModel<U>
> extends BaseLog<U> {
  public resourceType: T;

  constructor(model: V, user: AuthUser, resourceType: T) {
    super(model, user);
    this.resourceType = resourceType;
  }
}
