import { TableNames, Tables } from 'lib/middlewares/sequelize';
import {
  AndOperator,
  Includeable,
  Op,
  OrOperator,
  Sequelize,
  WhereAttributeHash,
} from 'sequelize';
import odata from 'odata-sequelize';
import { ContextQuery } from './types';
import { Cast } from 'sequelize/types/lib/utils';

// Some weird external lib error unless type is defined....
type GetContextQuery<
  TableName extends keyof Tables,
  Table extends Tables[TableName] = Tables[TableName],
  Model extends Tables[TableNames]['model'] = Table['model']
> = Extract<keyof Model['_attributes'], 'tenant_id' | 'tenantId'> extends string
  ? // this type is not technically correct...
    // [Op.Or] is really optional but sequelize typing doesn't accept it as optional
    {
      [k in Extract<
        keyof Model['_attributes'],
        'tenant_id' | 'tenantId'
      >]?: string;
    } & GetOrContextQuery
  : GetOrContextQuery;

export type GetOrContextQuery = {
  [Op.or]?: (
    | {
        createdById: string;
      }
    | {
        created_by: string;
      }
    | {
        user_id: string;
      }
    | {
        assigned_user_id: string;
      }
    | {
        id: {
          [Op.in]: string[];
        };
      }
  )[];
};

type GetTimeRangeQuery<T extends {}> = {
  [K in keyof T]: GetAndTimeRangeQuery;
};

export type GetAndTimeRangeQuery = {
  [Op.and]: { [Op.gte]?: string; [Op.lte]?: string };
};

export type WhereOptions<
  TableName extends keyof Tables,
  Table extends Tables[TableName] = Tables[TableName],
  Model extends Table['model'] = Table['model']
> = WhereAttributeHash<Model['_attributes']> &
  Partial<OrOperator<Model['_attributes']>> &
  Partial<AndOperator<Model['_attributes']>>;

/**
 * Where is a generic class that makes it a bit easier to construct sequelize
 * queries and is bound to a specific model to enforce proper types.
 */
export default class Where<
  TableName extends keyof Tables,
  Table extends Tables[TableName] = Tables[TableName],
  Model extends Table['model'] = Table['model']
> {
  // holds the context query provided by the user
  private contextQuery: ContextQuery;
  // holds the constructed where context query
  private builtContext: GetContextQuery<TableName>;
  // holds the raw sql queries that determines whether a record is implicitly public
  private publicImplicitQueries: string[];
  // holds the public query provided by user
  private publicQuery: WhereOptions<TableNames>;

  private sequelize: Sequelize;
  protected validAttrs: string[];
  protected where: WhereOptions<TableName>;

  constructor(sequelize: Sequelize, validAttrs: string[]) {
    this.sequelize = sequelize;
    this.validAttrs = validAttrs;
    this.where = {};

    this.contextQuery = {};
    this.builtContext = {};
    this.publicImplicitQueries = [];
    this.publicQuery = { [Op.or]: [] };
  }

  /**
   * Outputs the where clause as a sequelize where object. If a context
   * object was provided, that is also built into the resulting where object.
   */
  public build(where?: WhereOptions<TableName>): WhereOptions<TableName> {
    if (where) {
      this.merge(where);
    }

    this.buildContext();

    // if no tenantId provided, no need for public querying
    // if no public query provided, no need for public querying
    if (
      !this.contextQuery.tenantId ||
      (this.publicQuery[Op.or] as any).length === 0
    ) {
      this.merge(this.builtContext);
      return this.where;
    }

    const publicQuery = {
      ...this.where,
      ...this.publicQuery,
    };
    this.merge(this.builtContext);

    /**
     * We're creating a root level OR clause that will contain the public query
     * and the context query.
     */
    this.where = {
      [Op.or]: [this.where, publicQuery],
    };

    return this.where;
  }

  /**
   * Constructs a time range clause at the root level.
   *
   * Example:
   * this.timeRange('createdAt', { gte: '2020-01-01', lte: '2020-01-02' })
   *
   * {
   *   createdAt: {
   *     [Op.and]: {
   *       [Op.gte]: '2020-01-01',
   *       [Op.lte]: '2020-01-02',
   *     }
   *   }
   * }
   */
  public timeRange(
    field: keyof Model['_attributes'],
    opts: { start?: string; end?: string }
  ) {
    const rangeClause: GetAndTimeRangeQuery = {
      [Op.and]: {},
    };

    if (!opts.start && !opts.end) {
      return this;
    }

    if (opts.start) {
      rangeClause[Op.and][Op.gte] = opts.start;
    }
    if (opts.end) {
      rangeClause[Op.and][Op.lte] = opts.end;
    }

    const query = {
      [field as keyof Model['_attributes']]: rangeClause,
    } as GetTimeRangeQuery<Model['_attributes']>;

    this.merge(query);

    return this;
  }

  /**
   * Adds an ILIKE search clause encapsulated within an OR clause.
   * This is useful when searching across multiple fields.
   *
   * Example:
   * this.iLike('search term', 'field1', 'field2');
   *
   * {
   *   [Op.and]: [
   *     [Op.or]: [
   *       { field1: { [Op.iLike]: '%search term%' } },
   *       { field2: { [Op.iLike]: '%search term%' } },
   *     ]
   *   ]
   * }
   *
   */
  public iLike(searchTerm: string, ...fields: (keyof Model['_attributes'])[]) {
    const orItems = fields.map((field) => ({
      [field]: {
        [Op.iLike]: `%${searchTerm}%`,
      },
    })) as WhereOptions<TableName>[];

    this.merge({
      [Op.and]: [{ [Op.or]: orItems }],
    });

    return this;
  }

  /**
   * Adds an OR search clause as a child of an existing AND clause.
   * This is necessary to maintain context querying.
   *
   * Example:
   * this.or({ field1: 'value1' }, { field2: 'value2' });
   *
   * {
   *  [Op.and]: [
   *    ...existing and query,
   *    {
   *      [Op.or]: [
   *        { field1: 'value1' },
   *        { field2: 'value2' },
   *      ]
   *    }
   *  ]
   * }
   */
  public or(opts: WhereOptions<TableName>[]) {
    this.merge({
      [Op.and]: [
        {
          [Op.or]: opts,
        },
      ],
    });

    return this;
  }

  public and(opts: WhereOptions<TableName>[]) {
    this.merge({
      [Op.and]: opts,
    });

    return this;
  }

  /**
   * Constructs the public query using an IN clause. This is intended to be
   * used in situations where the public data is through an association.
   *
   * Example:
   * CategoryDB can be public if a public CourseDB references it.
   *
   * this.publicIn('id', 'CourseDB', 'category_id');
   *
   * After calling `build`, this will become. Where query is the constructed query:
   * {
   *   [Op.or]: [
   *     { ...(query), ...(context) },
   *     { ...(query), [Op.in]: { [key]: (SELECT `publicKey` FROM `table` WHERE (...public where)) } }
   *   ]
   * }
   */
  public publicIn<T extends TableNames>(
    key: keyof Model['_attributes'],
    publicTableName: string,
    publicKey: keyof Tables[T]['model']['_attributes'],
    publicWhere: WhereOptions<T>
  ) {
    const generator = (this.sequelize.getQueryInterface() as any)
      .queryGenerator;

    const rawSql = generator
      .selectQuery(publicTableName, {
        attributes: [publicKey],
        where: publicWhere,
      })
      .slice(0, -1); // trim the trailing `;`

    (this.publicQuery[Op.or] as any).push({
      [key]: {
        [Op.in]: Sequelize.literal(`(${rawSql})`),
      },
    });

    return this;
  }

  /**
   * Some resources become implicitly public if they are associated with a public
   * resource. e.g. a public course implicitly makes a category public.
   * This is meant to be joined using a UNION if there are multiple sources of
   * an implicit public relationship.
   *
   * Example query built:
   *
   * select true
   * from publicTableName
   * where
   *  (...publicWhere) AND
   *  publicTableName.publicKey = parentTableName.parentKey
   */
  public publicImplicit<T extends TableNames>(
    parentTableName: TableName,
    parentKey: keyof Model['_attributes'],
    publicTableName: string,
    publicKey: keyof Tables[T]['model']['_attributes'],
    publicWhere: WhereOptions<T>
  ) {
    const generator = (this.sequelize.getQueryInterface() as any)
      .queryGenerator;

    const rawSql = generator
      .selectQuery(publicTableName, {
        attributes: [Sequelize.literal('true')],
        where: {
          [Op.and]: [
            publicWhere,
            Sequelize.literal(
              `"${publicTableName}"."${String(
                publicKey
              )}" = "${parentTableName}"."${String(parentKey)}"`
            ),
          ],
        },
      })
      .slice(0, -1) as string;

    this.publicImplicitQueries.push(rawSql);
  }

  /**
   * Joins the public implicit queries using a UNION.
   */
  public buildPublicImplicit() {
    const attribute = this.publicImplicitQueries.join(' UNION ') + ' LIMIT 1';

    return [
      Sequelize.cast(Sequelize.literal(`(${attribute})`), 'boolean'),
      'isPublic',
    ] as [Cast, string];
  }

  public buildCountQuery<T extends TableNames>(
    parentTableName: T,
    parentKey: keyof Tables[T]['model']['_attributes'],
    publicTableName: string,
    publicKey: keyof Model['_attributes'],
    publicWhere: WhereOptions<TableName>,
    countName: string,
    include: Includeable[] = []
  ) {
    const generator = (this.sequelize.getQueryInterface() as any)
      .queryGenerator;

    // need to clone before build
    const newPublicWhere = {
      ...this.where,
      ...publicWhere,
    };

    // also filter the context query by parent
    this.and([
      Sequelize.literal(
        `"${publicTableName}"."${String(
          publicKey
        )}" = "${parentTableName}"."${String(parentKey)}"`
      ),
    ]);

    const rawSql = generator
      .selectQuery(publicTableName, {
        include,
        where: {
          [Op.or]: [
            this.build(),
            {
              [Op.and]: [
                newPublicWhere,
                Sequelize.literal(
                  `"${publicTableName}"."${String(
                    publicKey
                  )}" = "${parentTableName}"."${String(parentKey)}"`
                ),
              ],
            },
          ],
        },
      })
      .replace('null.*', 'count(*)')
      .slice(0, -1); // trim the trailing `;`

    return [
      Sequelize.cast(Sequelize.literal(`(${rawSql})`), 'integer'),
      countName,
    ] as [Cast, string];
  }

  /**
   * Constructs the public query using a WHERE clause. This is intended
   * to be used in situations where determining public status can be deduced
   * directly from the table, rather than through a relationship.
   *
   * Example:
   * CourseDB has "isPublic" column to indicate public:
   *
   * this.public({ isPublic: true });
   *
   * After calling `build`, this will become. Where query is the constructed query:
   * {
   *   [Op.or]: [
   *     { ...(query), ...(context) },
   *     { ...(query), isPublic: true }
   *   ]
   * }
   */
  public publicWhere(publicWhere: WhereOptions<TableName>) {
    (this.publicQuery[Op.or] as any).push({
      ...publicWhere,
    });

    return this;
  }

  public context(contextQuery: ContextQuery) {
    this.contextQuery = contextQuery;

    return this;
  }

  /**
   * Transforms the context query into appropriate query restriction.
   *
   * e.g. if context provides "tenantId", then the query will be restricted to
   * the tenant but only if a valid tenant id attribute exists in the model.
   */
  private buildContext() {
    const where: GetContextQuery<TableName> = {
      [Op.and]: [],
    } as any;

    if (this.contextQuery.tenantId) {
      if (this.validAttrs.includes('tenant_id')) {
        (where as any).tenant_id = this.contextQuery.tenantId;
      }
      if (this.validAttrs.includes('tenantId')) {
        (where as any).tenantId = this.contextQuery.tenantId;
      }
    }

    const orItems = [];
    if (this.contextQuery.userId) {
      if (this.validAttrs.includes('user_id')) {
        orItems.push({
          user_id: this.contextQuery.userId,
        });
      }
      if (this.validAttrs.includes('created_by')) {
        orItems.push({
          created_by: this.contextQuery.userId,
        });
      }
      if (this.validAttrs.includes('createdById')) {
        orItems.push({
          createdById: this.contextQuery.userId,
        });
      }
      if (this.validAttrs.includes('assigned_user_id')) {
        orItems.push({
          assigned_user_id: this.contextQuery.userId,
        });
      }
    }

    if (this.contextQuery.ownedIds) {
      if (this.validAttrs.includes('id')) {
        orItems.push({
          id: {
            [Op.in]: this.contextQuery.ownedIds,
          },
        });
      }
    }

    if (orItems.length > 0) {
      this.builtContext = {
        ...where,
        [Op.and]: [{ [Op.or]: orItems }],
      };
      return;
    }

    this.builtContext = {
      ...where,
    };
  }

  /**
   * Basic merge which adds onto the Where builder. This is mainly used for
   * a query object that is not defined by one of the other util methods.
   */
  public merge(where: WhereOptions<TableName> | GetContextQuery<TableName>) {
    const newWhere = Object.entries(where).reduce(
      (acc, [key, value]) => {
        try {
          if (Array.isArray(value)) {
            const hasOperator = value.some(
              (v) => v.startsWith('eq') || v.startsWith('ne')
            );
            if (hasOperator) {
              value = value.map((v) => `${key} ${v}`).join(' or ');
              value = (odata(`$filter=${value}`, this.sequelize) as any).where[
                Op.or
              ];
              (acc as any)[key] = {
                [Op.or]: (value as []).map((v) => v[key]),
              };
              return acc;
            }
          }

          if (
            typeof value === 'string' &&
            (value.startsWith('eq') || value.startsWith('ne'))
          ) {
            value = (odata(`$filter=${key} ${value}`, this.sequelize) as any)
              .where[key];
          }
        } catch (error) {}

        (acc as any)[key] = value;
        // normally, shouldn't need this but more of a workaround...
        if (value === undefined) {
          delete (acc as any)[key];
        }

        return acc;
      },
      { ...where }
    );

    if (Array.isArray(newWhere[Op.or])) {
      this.where[Op.or] = ((this.where[Op.or] as []) || []).concat(
        newWhere[Op.or] as []
      );
    }
    if (Array.isArray((newWhere as any)[Op.and])) {
      this.where[Op.and] = ((this.where[Op.and] as []) || []).concat(
        (newWhere as any)[Op.and] as []
      );
    }

    delete newWhere[Op.or];
    delete (newWhere as any)[Op.and];

    this.where = {
      ...this.where,
      ...newWhere,
    };

    // unset empty arrays
    if (
      this.where[Op.or] &&
      Array.isArray(this.where[Op.or]) &&
      (this.where[Op.or] as []).length === 0
    ) {
      delete this.where[Op.or];
    }
    if (
      this.where[Op.and] &&
      Array.isArray(this.where[Op.and]) &&
      (this.where[Op.and] as []).length === 0
    ) {
      delete this.where[Op.and];
    }

    return this;
  }
}
