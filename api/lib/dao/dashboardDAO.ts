import {
  DashboardCreateDAO,
  DashboardModifyDAO,
} from 'lib/middlewares/sequelize';
import { TransactionOptions } from 'sequelize';
import { ContextQuery, Pagination } from './utils';
import DAO from './utils/DAO';

export class DashboardDAO extends DAO<'DashboardDB'> {
  async findAllByName(context: ContextQuery, name: string | string[]) {
    const builder = this.where();
    builder.merge({ name });
    builder.context(context);

    const dashboards = await this.repo.findAll({
      where: builder.build(),
    });

    return this.rowsToJSON(dashboards);
  }

  async find(context: ContextQuery, pagination: Pagination) {
    const builder = this.where();
    builder.context(context);

    const { count, rows } = await this.repo.findAndCountAll({
      where: builder.build(),
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(this.rowsToJSON(rows), count, pagination);
  }

  async findOneById(
    context: ContextQuery,
    id: string,
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    const dashboard = await this.repo.findOne({
      where: builder.build(),
      ...opts,
    });

    return this.toJSON(dashboard);
  }

  async create(payload: DashboardCreateDAO, opts: TransactionOptions = {}) {
    const dashboard = await this.repo.create(payload, opts);

    return this.toJSON(dashboard)!;
  }

  async updateById(
    context: ContextQuery,
    id: string,
    payload: DashboardModifyDAO
  ) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    const [, [dashboard]] = await this.repo.update(payload, {
      returning: true,
      where: builder.build(),
    });

    return this.toJSON(dashboard);
  }

  async deleteById(
    context: ContextQuery,
    id: string,
    opts: TransactionOptions
  ) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    await this.repo.destroy({
      where: builder.build(),
      ...opts,
    });
  }
}
