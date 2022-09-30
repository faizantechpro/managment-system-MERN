import {
  AnalyticAttr,
  ComponentAttr,
  DashboardComponentCreateDAO,
  DashboardComponentModifyDAO,
} from 'lib/middlewares/sequelize';
import { TransactionOptions } from 'sequelize';
import { ContextQuery, Pagination } from './utils';
import DAO from './utils/DAO';

export class DashboardComponentDAO extends DAO<'DashboardComponentDB'> {
  async findAllByDashboardId(dashboardId: string) {
    const dashboardComponents = await this.repo.findAll({
      where: {
        dashboardId,
      },
    });

    return this.rowsToJSON(dashboardComponents);
  }

  async findOneByDashboardIdWithAssociations(
    context: ContextQuery,
    dashboardId: string,
    pagination: Pagination,
    query?: {}
  ) {
    const contextBuilder = this.where();
    contextBuilder.context(context);

    const builder = this.where();
    builder.merge({ dashboardId });

    const { count, rows } = await this.repo.findAndCountAll({
      where: builder.build(),
      include: [
        {
          association: 'component',
          where: contextBuilder.build(),
          required: true,
          include: ['analytic'],
        },
      ],
    });

    return this.getPaginatedResponse(
      this.rowsToJSON<{
        component: ComponentAttr & { analytic: AnalyticAttr };
      }>(rows),
      count,
      pagination
    );
  }

  async findOneByCompositeIds(dashboardId: string, componentId: string) {
    const dashboardComponent = await this.repo.findOne({
      where: {
        dashboardId,
        componentId,
      },
    });

    return this.toJSON(dashboardComponent);
  }

  async create(
    payload: DashboardComponentCreateDAO,
    opts: TransactionOptions = {}
  ) {
    const dashboardComponent = await this.repo.create(payload, opts);

    return this.toJSON(dashboardComponent)!;
  }

  async updateByCompositeIds(
    dashboardId: string,
    componentId: string,
    payload: DashboardComponentModifyDAO,
    opts: TransactionOptions = {}
  ) {
    const [, [dashboardComponent]] = await this.repo.update(payload, {
      where: {
        dashboardId,
        componentId,
      },
      returning: true,
      ...opts,
    });

    return this.toJSON(dashboardComponent);
  }

  async deleteByDashboardId(
    dashboardId: string,
    opts: TransactionOptions = {}
  ) {
    await this.repo.destroy({
      where: {
        dashboardId,
      },
      ...opts,
    });
  }

  async deleteByComponentId(
    componentId: string,
    opts: TransactionOptions = {}
  ) {
    await this.repo.destroy({
      where: {
        componentId,
      },
      ...opts,
    });
  }

  async deleteByCompositeIds(
    dashboardId: string,
    componentId: string,
    opts: TransactionOptions = {}
  ) {
    await this.repo.destroy({
      where: {
        dashboardId,
        componentId,
      },
      ...opts,
    });
  }
}
