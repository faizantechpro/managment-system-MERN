import { ExcludeKey } from 'lib/utils';
import { NonAbstract } from 'sequelize-typescript/dist/shared/types';
import { TableNames, Tables } from 'lib/middlewares/sequelize';
import { Model } from 'sequelize-typescript';
import { ContextServices } from 'lib/middlewares/context';

export type DaoOpts = { services: ContextServices };

export type Pagination = {
  limit: number;
  page: number;
};

// the common resources that requires generic implementation
export type Resources = 'contact' | 'deal' | 'organization';

export type ResourceKeys = 'contact_id' | 'organization_id' | 'deal_id';

type ContextFields = {
  // admins can query from any tenant
  // owners can only query by their tenant
  tenantId?: string;

  // users must query by their tenant and created_by_id
  userId?: string;

  // for resources a user owns (applicable to standard users)
  ownedIds?: string[];
};

/**
 * Allows additional context(s) for associated models
 *
 * e.g. Course may want a tenant query but progress will want a sub query bound
 * to the current user context
 */
export type SubContextQuery<T extends string | number | symbol> = {
  [K in T]?: ContextFields;
};

export type ContextQuery<T extends TableNames = TableNames> = ContextFields &
  SubContextQuery<keyof Tables[T]['repo']['associations']>;

/**
 * This type allows us to create sequelize-typescript repositories using
 * generic parameters.
 *
 * For example:
 *
 * class GenericCommonModels<T extends UserDB | ContactDB> extends Base<T> {}
 *
 * using built in `Repository` would return models as `Model<any, any>`
 * instead of `Model<UserDB | ContactDB>`.
 */
export type GenericRepository<
  TableName extends TableNames,
  TableModel extends Tables[TableName]['model'] = Tables[TableName]['model']
> = Pick<
  NonAbstract<typeof Model>,
  ExcludeKey<NonAbstract<typeof Model>, 'associations'>
> &
  (new () => TableModel);
