import { ExpandModel, StaticModel } from 'lib/database/helpers';
import { AuthUser } from 'lib/middlewares/auth';
import { Pagination } from 'lib/types';
import {
  Model,
  Op,
  OrOperator,
  Transaction,
  WhereAttributeHash,
} from 'sequelize';

export type PaginationResponse<T extends Model, U = {}> = {
  data: (ReturnType<ExpandModel<T>['toJSON']> & U)[];
  pagination: {
    limit: number;
    page: number;
    totalPages: number;
    count: number;
  };
};

export type SequelizeOpts = Parameters<Base<Model>['getSequelizeOpts']>[0];

/**
 * Base abstract class for other services to extend. Contains utility functions
 * for pagination, default CRUD, etc.
 */
export default abstract class Base<
  T extends Model,
  U extends StaticModel<T> = StaticModel<T>
> {
  protected model: U;
  protected user: AuthUser;

  constructor(model: U, user: AuthUser) {
    this.model = model;
    this.user = user;
  }

  /**
   * Returns a properly type casted where object
   */
  protected getWhere(): WhereAttributeHash<T['_attributes']> &
    Partial<OrOperator<T['_attributes']>> {
    return {};
  }

  protected rowsToJSON<U = {}>(
    rows: ExpandModel<T>[]
  ): (ReturnType<ExpandModel<T>['toJSON']> & U)[] {
    return rows.map((row) => row.toJSON());
  }

  /**
   * Helper function to get the paginated response format
   */
  protected getPaginatedResponse(
    rows: ExpandModel<T>[],
    count: number,
    pagination: Pagination
  ): PaginationResponse<T> {
    return {
      data: this.rowsToJSON(rows),
      pagination: {
        limit: Number(pagination.limit),
        page: Number(pagination.page),
        totalPages: Math.ceil(count / pagination.limit),
        count,
      },
    };
  }

  protected getPaginationQuery(pagination: Pagination) {
    return {
      limit: pagination.limit,
      offset: pagination.limit * (pagination.page - 1),
    };
  }

  protected getSequelizeOpts(opts: { transaction?: Transaction }) {
    return {
      ...(opts.transaction ? { transaction: opts.transaction } : {}),
    };
  }

  protected getSearchQuery(
    searchTerm: string,
    ...searchKeys: (keyof T['_attributes'])[]
  ) {
    return {
      [Op.or]: searchKeys.map((key) => {
        return {
          [key]: { [Op.iLike]: `%${searchTerm}%` },
        };
      }),
    } as OrOperator<T['_attributes']>;
  }

  protected async defaultFindById(
    id: string,
    opts: {
      where?: ReturnType<Base<T>['getWhere']>;
    } = {}
  ): Promise<ReturnType<ExpandModel<T>['toJSON']> | null | undefined> {
    const resource = await this.model.findOne({
      where: {
        id,
        ...(!!opts.where ? opts.where : {}),
      },
    });

    return resource?.toJSON();
  }

  protected async defaultCreate(
    payload: Parameters<U['create']>[0]
  ): Promise<ReturnType<ExpandModel<T>['toJSON']>> {
    const resource = await this.model.create(payload, { returning: true });
    return resource.toJSON();
  }

  protected async defaultUpdateById(
    id: string,
    payload: Parameters<U['update']>[0],
    opts: {
      where?: ReturnType<Base<T>['getWhere']>;
    } = {}
  ): Promise<ReturnType<ExpandModel<T>['toJSON']> | null | undefined> {
    const [totalUpdated, resources] = await this.model.update(payload, {
      where: {
        id,
        ...(!!opts.where ? opts.where : {}),
      },
      returning: true,
    });

    if (!totalUpdated) {
      return;
    }

    return resources[0].toJSON();
  }

  protected async defaultDeleteById(
    id: string | string[],
    opts: {
      where?: ReturnType<Base<T>['getWhere']>;
    } = {}
  ) {
    const deleted = await this.model.destroy({
      where: {
        id,
        ...(!!opts.where ? opts.where : {}),
      },
    });
    return deleted;
  }
}
