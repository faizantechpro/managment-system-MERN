import { ContextServices } from 'lib/middlewares/context';
import { Order, Tables, ToGenericRepository } from 'lib/middlewares/sequelize';
import {
  Transaction,
  TransactionOptions,
  Order as SequelizeOrder,
} from 'sequelize';
import { Model } from 'sequelize-typescript';
import { DaoOpts, Pagination } from './types';
import Where from './Where';

/**
 * DAO is a generic class that stores the sequelize database repository in
 * order to provide utility functions like parsing the paginated response
 * object or creating a pagination object.
 */
export default class DAO<
  TableName extends keyof Tables,
  Table extends Tables[TableName] = Tables[TableName],
  TableModel extends Table['model'] = Table['model'],
  Repository extends ToGenericRepository<TableName> = ToGenericRepository<TableName>
> {
  public repo: Repository;
  protected services: ContextServices;

  constructor(repo: Repository, opts: DaoOpts) {
    this.repo = repo;
    this.services = opts.services;
  }

  /**
   * Wraps a provided function in a sequelize transaction and supports nested transactions
   */
  public transaction<T>(
    opts: TransactionOptions,
    fn: (t: Transaction) => Promise<T>
  ): Promise<T>;
  public transaction<T>(fn: (t: Transaction) => Promise<T>): Promise<T>;
  public transaction<T>(
    ...args:
      | [opts: TransactionOptions, fn: (t: Transaction) => Promise<T>]
      | [fn: (t: Transaction) => Promise<T>]
  ) {
    if (args.length === 1) {
      return this.repo.sequelize!.transaction(args[0]);
    }
    const [opts, fn] = args;

    if (Object.keys(opts).length === 0) {
      return this.repo.sequelize!.transaction(fn);
    }
    return this.repo.sequelize!.transaction(opts, fn);
  }

  /**
   * Initiates a typed Where instance that is bound to the current db model.
   */
  public where() {
    return new Where<TableName>(
      this.repo.sequelize!,
      Object.keys(this.repo.rawAttributes)
    );
  }

  /**
   * Constructs the Sequelize order array but if a dot notated item is passed
   * it will construct the necessary Sequelize order object.
   *
   * Example:
   *
   * select *
   * from courses c
   * join progress p on p.course_id = c.id
   *
   * Suppose you want to order by progress.created_at, you'll now provide the following:
   *
   * this.buildOrder([ 'progress.created_at', 'asc nulls first ]);
   *
   * This will construct the following count query:
   *
   * ```
   * ORDER BY "progress"."created_at" ASC NULLS FIRST
   * ```
   */
  public buildOrder(orders: Order[]) {
    return orders.map(([key, sort]) => {
      // nothing special to do, keep same order
      if (!key.includes('.')) {
        return [key, sort];
      }

      const [association, column] = key.split('.');

      return [
        {
          model: (this.repo.associations as any)[association].target,
          as: association,
        },
        column,
        sort,
      ];
    }) as SequelizeOrder;
  }

  public genericRowsToJSON<T extends Model>(models: T[]) {
    return models.map((model) => this.genericToJSON(model)!);
  }
  public genericToJSON<T extends Model>(
    model?: T | null
  ): undefined | T['_attributes'] {
    if (!model?.toJSON) {
      return model as unknown as T['_attributes'];
    }
    return model?.toJSON() as T['_attributes'];
  }

  /**
   * Converts a sequelize models into the proper typed JSON format.
   */
  public rowsToJSON<T = {}>(models: TableModel[]) {
    return models.map((model) => this.toJSON<T>(model)!);
  }

  /**
   * Converts a sequelize model into the proper typed JSON format.
   */
  public toJSON<T = {}>(
    model?: TableModel | null
  ): undefined | (TableModel['_attributes'] & T) {
    return this.genericToJSON(model);
  }

  /**
   * Formats a paginated query into the expected paginated response for
   * API.
   *
   * the generic param does nothing but required for some reason?
   */
  public getPaginatedResponse<TableModel>(
    rows: TableModel[],
    count: number,
    pagination: Pagination
  ) {
    return {
      data: rows!,
      pagination: {
        limit: Number(pagination.limit),
        page: Number(pagination.page),
        totalPages: Math.ceil(count / pagination.limit),
        count,
      },
    };
  }

  /**
   * Simple helper that returns the pagination object based on page/limit.
   */
  public getPaginationQuery(pagination: Pagination) {
    return {
      limit: pagination.limit,
      offset: pagination.limit * (pagination.page - 1),
    };
  }
}
