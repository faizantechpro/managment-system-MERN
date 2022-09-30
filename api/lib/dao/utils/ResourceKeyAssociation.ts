import { TableNames, Tables } from 'lib/middlewares/sequelize';
import { IncludeOptions } from 'sequelize';
// Yes, GetContextQuery is unused but type is required for some weird import error
import DAO from './DAO';
import { ContextQuery, ResourceKeys } from './types';

export type ValidResourceKeys<T extends TableNames> = Extract<
  keyof Tables[T]['model']['_attributes'],
  ResourceKeys
>;

/**
 * This class is intended to be the base class for associating a resource by
 * using a resource key as a different pivot key.
 *
 * For example: People who are `Owners` are required for contacts, organizations,
 * and deals but use a `Owner` table and corresponding pivot keys to join to the user
 * table. i.e. (contact_id, organization_id, deal_id). Whereas followers use the
 * same keys but `Follower` tables.
 */
export default abstract class ResourceKeyAssociation<
  TableName extends TableNames,
  AssociationName extends TableNames,
  ResourceKey extends ValidResourceKeys<TableName>
> extends DAO<TableName> {
  protected resourceKey: ResourceKey;

  constructor(
    resourceKey: ResourceKey,
    ...args: ConstructorParameters<typeof DAO>
  ) {
    super(...args);

    this.resourceKey = resourceKey;
  }

  // Get the target table of the FK association
  protected abstract getAssociation(): {
    name: Exclude<
      keyof Tables[TableName]['repo']['associations'],
      number | symbol
    >;
    dao: DAO<AssociationName>;
  };

  protected buildAssociationInclude(
    context: ContextQuery,
    opts: IncludeOptions
  ) {
    const associated = this.getAssociation();

    const builder = associated.dao.where();
    return {
      ...opts,
      as: associated.name,
      model: associated.dao.repo,
      where: builder.context(context).build(),
    };
  }
}
