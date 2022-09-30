import { Tables, ToGenericRepository } from 'lib/middlewares/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ContextQuery, DaoOpts, Pagination, Resources } from './utils';
import DAO from './utils/DAO';
import ResourceKeyAssociation, {
  ValidResourceKeys,
} from './utils/ResourceKeyAssociation';

export type OwnerDAOFactory<T extends Resources> = T extends 'contact'
  ? {
      tableName: 'ContactOwnerDB';
      associationName: 'ContactDB';
      dao: ContactOwnerDAO;
      repo: ToGenericRepository<'ContactOwnerDB'>;
    }
  : T extends 'deal'
  ? {
      tableName: 'DealOwnerDB';
      associationName: 'DealDB';
      dao: DealOwnerDAO;
      repo: ToGenericRepository<'DealOwnerDB'>;
    }
  : T extends 'organization'
  ? {
      tableName: 'OrganizationOwnerDB';
      associationName: 'OrganizationDB';
      dao: OrganizationOwnerDAO;
      repo: ToGenericRepository<'OrganizationOwnerDB'>;
    }
  : never;

abstract class OwnerDAO<
  Resource extends Resources,
  ResourceKey extends ValidResourceKeys<
    OwnerDAOFactory<Resource>['tableName']
  > = ValidResourceKeys<OwnerDAOFactory<Resource>['tableName']>
> extends ResourceKeyAssociation<
  OwnerDAOFactory<Resource>['tableName'],
  OwnerDAOFactory<Resource>['associationName'],
  ResourceKey
> {
  // Finds owners associated through their parent models
  async findByParent(context: ContextQuery, pagination: Pagination) {
    const { rows: owners } = await this.repo.findAndCountAll({
      ...this.getPaginationQuery(pagination),
      include: [
        this.buildAssociationInclude(context, { attributes: [] }),
        'user',
      ],
      attributes: [
        'user_id',
        [
          Sequelize.cast(Sequelize.fn('COUNT', 'user_id'), 'integer'),
          'total_owned',
        ],
      ],
      order: [[Sequelize.literal('total_owned'), 'DESC']],
      // need to group by join to avoid aggregate error
      group: ['user_id', 'user.id'],
    });

    const parsedOwners = owners.map((owner) => {
      return {
        user_id: owner.user_id,
        total_owned: owner.get('total_owned') as number,
        user: owner.user.toJSON() as Tables['UserDB']['model']['_attributes'],
      };
    });

    return { data: parsedOwners };
  }

  async findAllAsResourceIds(context: ContextQuery) {
    const builder = this.where();

    const owned = await this.repo.findAll({
      where: builder.context(context).build(),
      attributes: [this.resourceKey],
    });

    return this.rowsToJSON(owned).map(
      (resource) => (resource as any)[this.resourceKey] as string
    );
  }
}

class ContactOwnerDAO extends OwnerDAO<'contact'> {
  constructor(...args: ConstructorParameters<typeof DAO>) {
    super('contact_id', ...args);
  }

  protected getAssociation() {
    return {
      name: 'contact' as const,
      dao: this.services.dao.contact,
    };
  }
}

class DealOwnerDAO extends OwnerDAO<'deal'> {
  constructor(...args: ConstructorParameters<typeof DAO>) {
    super('deal_id', ...args);
  }

  protected getAssociation() {
    return {
      name: 'deal' as const,
      dao: this.services.dao.deal,
    };
  }
}

class OrganizationOwnerDAO extends OwnerDAO<'organization'> {
  constructor(...args: ConstructorParameters<typeof DAO>) {
    super('organization_id', ...args);
  }

  protected getAssociation() {
    return {
      name: 'organization' as const,
      dao: this.services.dao.organization,
    };
  }
}

export function ownerDAOFactory<T extends Resources>(
  type: T,
  repo: OwnerDAOFactory<T>['repo'],
  opts: DaoOpts
) {
  if (type === 'contact') {
    return new ContactOwnerDAO(repo, opts) as OwnerDAOFactory<T>['dao'];
  } else if (type === 'deal') {
    return new DealOwnerDAO(repo, opts) as OwnerDAOFactory<T>['dao'];
  } else if (type === 'organization') {
    return new OrganizationOwnerDAO(repo, opts) as OwnerDAOFactory<T>['dao'];
  }

  throw new Error('unknown dao type');
}
