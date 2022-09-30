import DAO from './utils/DAO';
import { ContextQuery, Pagination } from './utils';
import {
  AnalyticAttr,
  ComponentCreateDAO,
  ComponentModifyDAO,
} from 'lib/middlewares/sequelize';
import { TransactionOptions } from 'sequelize';

export class ComponentDAO extends DAO<'ComponentDB'> {
  async findAllById(context: ContextQuery, id: string | string[]) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    const components = await this.repo.findAll({
      where: builder.build(),
    });

    return this.rowsToJSON(components);
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

  async findByAnalyticId(
    context: ContextQuery,
    analyticId: string,
    pagination: Pagination
  ) {
    const builder = this.where();
    builder.merge({
      analyticId,
    });
    builder.context(context);

    const { count, rows } = await this.repo.findAndCountAll({
      where: builder.build(),
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(this.rowsToJSON(rows), count, pagination);
  }

  async findByDashboardId(
    context: ContextQuery,
    dashboardId: string,
    pagination: Pagination
  ) {
    const builder = this.where();
    builder.context(context);

    const { count, rows } = await this.repo.findAndCountAll({
      where: builder.build(),
      include: [
        {
          association: 'dashboardComponents',
          where: { dashboardId },
          attributes: [],
          required: true,
        },
        'analytic',
      ],
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(
      this.rowsToJSON<{ analytic: AnalyticAttr }>(rows),
      count,
      pagination
    );
  }

  async findOneById(context: ContextQuery, id: string) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    const component = await this.repo.findOne({
      where: builder.build(),
    });

    return this.toJSON(component);
  }

  async create(payload: ComponentCreateDAO, opts: TransactionOptions = {}) {
    const component = await this.repo.create(payload, opts);

    return this.toJSON(component)!;
  }

  async updateById(
    context: ContextQuery,
    id: string,
    payload: ComponentModifyDAO,
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    const [, [component]] = await this.repo.update(payload, {
      where: builder.build(),
      returning: true,
      ...opts,
    });

    return this.toJSON(component);
  }

  async deleteById(
    context: ContextQuery,
    id: string | string[],
    opts: TransactionOptions = {}
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
