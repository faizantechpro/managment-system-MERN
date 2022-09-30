import { Sequelize } from 'sequelize-typescript';
import { Includeable, Op } from 'sequelize';
import { ContextQuery, DaoOpts, Pagination, Resources } from './utils';
import ResourceKeyAssociation, {
  ValidResourceKeys,
} from './utils/ResourceKeyAssociation';
import { ToGenericRepository } from 'lib/middlewares/sequelize';
import DAO from './utils/DAO';
import { DealDAO } from './dealDAO';

export type FeedResourceDAOFactory<T extends Resources> = T extends 'contact'
  ? {
      tableName: 'FeedDB';
      associationName: 'ContactDB';
      dao: FeedContactDAO;
      repo: ToGenericRepository<'FeedDB'>;
    }
  : T extends 'deal'
  ? {
      tableName: 'FeedDB';
      associationName: 'DealDB';
      dao: FeedDealDAO;
      repo: ToGenericRepository<'FeedDB'>;
    }
  : T extends 'organization'
  ? {
      tableName: 'FeedDB';
      associationName: 'OrganizationDB';
      dao: FeedOrganizationDAO;
      repo: ToGenericRepository<'FeedDB'>;
    }
  : never;

abstract class FeedResourceDAO<
  Resource extends Resources,
  ResourceKey extends ValidResourceKeys<
    FeedResourceDAOFactory<Resource>['tableName']
  > = ValidResourceKeys<FeedResourceDAOFactory<Resource>['tableName']>
> extends ResourceKeyAssociation<
  FeedResourceDAOFactory<Resource>['tableName'],
  FeedResourceDAOFactory<Resource>['associationName'],
  ResourceKey
> {
  // in case base association needs to include additional relationship
  protected abstract getAssociationInclude(): Includeable[];

  // Returns sorted associated entities ordered by recent feed activity
  async findAsRecentlyViewed<T = {}>(
    context: ContextQuery,
    pagination: Pagination,
    query: { start_date?: string; end_date?: string } & T // i don't like this but deal has a bunch of custom queries...
  ) {
    const { start_date, end_date, ...associatedQuery } = query;

    const association = this.getAssociation();
    const builder = association.dao.where();
    builder.merge(associatedQuery as any);
    builder.context(context);
    builder.merge({ deleted: false });

    const feedBuilder = this.where();
    feedBuilder.merge({
      // resourceKey is correct type but query builder doesn't like it...
      [this.resourceKey as any]: {
        [Op.ne]: null,
      },
    });
    feedBuilder.timeRange('updated_at', { start: start_date, end: end_date });

    // count is a total count of grouped by columns, not the total count of
    // the query. therefore it must be casted to [] and then get length
    const { count, rows } = await association.dao.repo.findAndCountAll({
      include: [
        {
          as: 'feeds',
          model: this.repo,
          where: feedBuilder.build(),
          attributes: [],
          order: [['updated_at', 'DESC']],
        },
        ...this.getAssociationInclude(),
      ],
      attributes: {
        include: [
          [
            Sequelize.fn('MAX', Sequelize.literal('feeds.updated_at')),
            'last_activity_date',
          ],
        ],
      },
      // requires raw otherwise includes fail..
      raw: true,
      group: [`${association.dao.repo.name}.id`],
      order: [
        [
          Sequelize.fn(
            'MAX',
            Sequelize.literal(`"${association.dao.repo.name}".date_modified`)
          ),
          'DESC',
        ],
        [Sequelize.fn('MAX', Sequelize.literal('feeds.updated_at')), 'DESC'],
      ],
      where: builder.build(),
      ...association.dao.getPaginationQuery(pagination),
      // see this: https://github.com/sequelize/sequelize/issues/4446
      subQuery: false,
    });

    // i hate this but include isn't properly adding stuff into nested objects
    const parsedRows = rows.map((row) => {
      const toObj = Object.entries(row).reduce((acc, [key, value]) => {
        if (!key.includes('.')) {
          (acc as any)[key] = value;
          return acc;
        }

        const [parentKey, childKey] = key.split('.');
        if (childKey.startsWith('delete')) {
          return acc;
        }

        if (!(acc as any)[parentKey]) {
          (acc as any)[parentKey] = {};
        }
        (acc as any)[parentKey][childKey] = value;
        return acc;
      }, {} as typeof row & { last_activity_date: string });

      return toObj;
    });

    return association.dao.getPaginatedResponse(
      association.dao.rowsToJSON(parsedRows),
      (count as unknown as []).length,
      pagination
    );
  }
}

class FeedContactDAO extends FeedResourceDAO<'contact'> {
  constructor(...args: ConstructorParameters<typeof DAO>) {
    super('contact_id', ...args);
  }

  protected getAssociation() {
    return {
      name: 'contact' as const,
      dao: this.services.dao.contact,
    } as const;
  }

  protected getAssociationInclude() {
    return [];
  }
}

class FeedDealDAO extends FeedResourceDAO<'deal'> {
  protected dealDAO: DealDAO;

  constructor(...args: ConstructorParameters<typeof DAO>) {
    super('deal_id', ...args);

    const association = this.getAssociation();
    this.dealDAO = new DealDAO(association.dao.repo, {
      services: this.services,
    });
  }

  protected getAssociation() {
    return {
      name: 'deal' as const,
      dao: this.services.dao.deal,
    } as const;
  }

  protected getAssociationInclude() {
    // sequelize bug where `id` is being returned even if not specified which messes with group by
    return [
      {
        as: 'organization',
        model: this.services.dao.organization.repo,
        required: false,
        attributes: [
          [Sequelize.fn('MAX', Sequelize.literal(`organization.name`)), 'name'],
          // only needed for aggregate group, will drop before returning
          [
            Sequelize.fn('ARRAY_AGG', Sequelize.literal('organization.id')),
            'delete_id',
          ],
        ] as any,
      },
    ];
  }

  async findAsRecentlyViewed(
    context: ContextQuery,
    pagination: Pagination,
    query: Parameters<DealDAO['queryBuilder']>[1]
  ) {
    const {
      // avoid time range query, let feed build it
      start_date,
      end_date,
      ...rest
    } = query;
    // avoid context query, and pass raw custom query
    const dealQuery = this.dealDAO.queryBuilder({}, rest) as Omit<
      ReturnType<DealDAO['queryBuilder']>,
      'tenant_id'
    >;

    const deals = await super.findAsRecentlyViewed(context, pagination, {
      start_date,
      end_date,
      ...dealQuery,
    });

    // since deals has an includable, need to expand upon it
    type Deals = (typeof deals['data'][number] & {
      organization: { name: string };
    })[];

    return deals as unknown as Omit<typeof deals, 'data'> & { data: Deals };
  }
}

class FeedOrganizationDAO extends FeedResourceDAO<'organization'> {
  constructor(...args: ConstructorParameters<typeof DAO>) {
    super('organization_id', ...args);
  }

  protected getAssociation() {
    return {
      name: 'organization' as const,
      dao: this.services.dao.organization,
    } as const;
  }

  protected getAssociationInclude() {
    return [];
  }
}

export function feedResourceDAOFactory<T extends Resources>(
  type: T,
  repo: FeedResourceDAOFactory<T>['repo'],
  opts: DaoOpts
) {
  if (type === 'contact') {
    return new FeedContactDAO(repo, opts) as FeedResourceDAOFactory<T>['dao'];
  } else if (type === 'deal') {
    return new FeedDealDAO(repo, opts) as FeedResourceDAOFactory<T>['dao'];
  } else if (type === 'organization') {
    return new FeedOrganizationDAO(
      repo,
      opts
    ) as FeedResourceDAOFactory<T>['dao'];
  }

  throw new Error('unknown dao type');
}
