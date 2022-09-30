import { Pagination } from 'lib/dao';
import { AnalyticModifyBiz } from 'lib/middlewares/sequelize';
import {
  DashboardAddComponentBiz,
  DashboardCreateBiz,
  DashboardModifyBiz,
  DashboardModifyComponentBiz,
} from 'lib/middlewares/sequelize';
import { Transaction, TransactionOptions } from 'sequelize';
import { Biz } from './utils';
import { UserQuery } from './utils/ContextQuery';

enum DefaultDashboard {
  Overview = 'Overview',
  Deal = 'Deal',
  Tasks = 'Tasks',
  Training = 'Training',
  Survey = 'Survey',
}

export class DashboardBiz extends Biz {
  async get(override: UserQuery | undefined, pagination: Pagination) {
    const context = await this.userQuery.build(override);

    return this.services.dao.dashboard.find(context, pagination);
  }

  async getComponentsById(
    override: UserQuery | undefined,
    id: string,
    pagination: Pagination,
    query: {}
  ) {
    const context = await this.userQuery.build(override);

    // ensure dashboard exists
    await this.getOneById(override, id);

    return this.services.dao.dashboardComponent.findOneByDashboardIdWithAssociations(
      context,
      id,
      pagination,
      query
    );
  }

  async getOneById(
    override: UserQuery | undefined,
    id: string,
    opts: TransactionOptions = {}
  ) {
    const context = await this.userQuery.build(override);

    const dashboard = await this.services.dao.dashboard.findOneById(
      context,
      id,
      opts
    );
    if (!dashboard) {
      throw new this.exception.ResourceNotFound('dashboard');
    }
    return dashboard;
  }

  async getOneDashboardComponentByCompositeIds(
    override: UserQuery | undefined,
    id: string,
    componentId: string
  ) {
    const dashboardComponent =
      await this.services.dao.dashboardComponent.findOneByCompositeIds(
        id,
        componentId
      );
    if (!dashboardComponent) {
      throw new this.exception.ResourceNotFound('dashboardComponent');
    }
  }

  async create(
    override: UserQuery | undefined,
    payload: DashboardCreateBiz,
    opts: TransactionOptions = {}
  ) {
    const context = await this.tenantQuery.build(override);

    return this.services.dao.dashboard.create(
      {
        ...payload,
        createdById: this.user.id,
        tenantId: context.tenantId,
      },
      opts
    );
  }

  async createDefault(override: UserQuery | undefined) {
    const context = await this.tenantQuery.build(override);

    const dashboards = await this.services.dao.dashboard.transaction(
      async (transaction) => {
        const transactionOpts = {
          transaction,
          isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
        };

        const [publicAnalytics, existingDashboards] = await Promise.all([
          this.services.dao.analytic.findAllPublic({}),
          this.services.dao.dashboard.findAllByName(
            context,
            Object.values(DefaultDashboard)
          ),
        ]);

        const dashboardsToCreate = Object.values(DefaultDashboard).filter(
          (name) => !existingDashboards.some((d) => d.name === name)
        );
        const dashboards = await Promise.all(
          dashboardsToCreate.map((name) =>
            this.create(override, { name }, transactionOpts)
          )
        );

        const defaultMapping: { [K in string]: string[] } = {
          Overview: [
            'Contacts Created - This Month',
            'Deals Lost - This Month',
            'Activities Completed - This Month',
            'Open Deals by Stage - This Month',
            'Revenue Won By Month',
            'Tasks Closed - This Month',
            'Top 5 Organizations',
            'Deals Won - This Month',
          ],
          Deal: [
            'Open Deals - This Month',
            'Deals Won - This Month',
            'Deals Lost - This Month',
            'Revenue Won - This Month',
            'Monthly Revenue By User',
            'Top 5 Users - Deals Won',
            'Top 5 Users - Deals Lost',
            'Open Deals by Stage - This Month',
          ],
          Tasks: [
            'Tasks Created - This Month',
            'Overdue Tasks - This Month',
            'Open Task - This Month',
            'Top 5 Users by Overdue Tasks',
            'Completed Task - This Month',
            'Top 5 Users by Completed Tasks',
          ],
          Training: [
            'Top 5 Lessons - Completed',
            'Top 5 Users by Lessons Completed',
            'Top 5 Courses - Completed',
            'Top 5 Users by Courses Completed',
            'Lessons Started - This Month',
            'Lessons Completed - This Month',
          ],
          Survey: [],
        };

        await Promise.all(
          dashboards.map(async (dashboard) => {
            const newComponents = publicAnalytics
              // ensure dashboard exists in mapping
              .filter(() => {
                return !!defaultMapping[dashboard.name];
              })
              .filter((analytic) => {
                return defaultMapping[dashboard.name].includes(analytic.name);
              })
              .map((analytic) => {
                return {
                  component: {
                    name: analytic.name,
                    analyticId: analytic.id,
                  },
                };
              });

            await Promise.all(
              newComponents.map((component) =>
                this.addComponent(
                  override,
                  dashboard.id,
                  component,
                  transactionOpts
                )
              )
            );
          })
        );

        return dashboards;
      }
    );

    return dashboards;
  }

  async addComponent(
    override: UserQuery | undefined,
    id: string,
    payload: DashboardAddComponentBiz,
    opts: TransactionOptions = {}
  ) {
    // ensure dashboard exists
    await this.getOneById(override, id, opts);

    const component = await this.services.dao.dashboardComponent.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
        ...opts,
      },
      async (transaction) => {
        // TODO restrict unique analyticId to 1 per dashboard?

        const component =
          await this.services.biz.component.createComponentWithAnalytic(
            override,
            payload,
            { transaction }
          );

        await this.services.dao.dashboardComponent.create(
          {
            dashboardId: id,
            componentId: component.id,
          },
          { transaction }
        );

        return component;
      }
    );

    return component;
  }

  async updateById(
    override: UserQuery | undefined,
    id: string,
    payload: DashboardModifyBiz
  ) {
    const context = await this.userQuery.build(override);

    const dashboard = await this.services.dao.dashboard.updateById(
      context,
      id,
      payload
    );
    if (!dashboard) {
      throw new this.exception.ResourceNotFound('dashboard');
    }
    return dashboard;
  }

  async updateComponent(
    override: UserQuery | undefined,
    id: string,
    componentId: string,
    payload: DashboardModifyComponentBiz
  ) {
    // ensure dashboard exists
    await this.getOneById(override, id);

    const updated = await this.services.dao.dashboardComponent.transaction(
      async (transaction) => {
        let componentPromise;
        if (payload.component) {
          componentPromise = this.services.biz.component.updateById(
            override,
            componentId,
            payload.component,
            { transaction }
          );
        }

        const component = await componentPromise;

        return {
          component,
        };
      }
    );

    return updated;
  }

  async updateComponentAnalytic(
    override: UserQuery | undefined,
    id: string,
    componentId: string,
    payload: AnalyticModifyBiz
  ) {
    // ensure dashboard exists
    await this.getOneById(override, id);

    await this.getOneDashboardComponentByCompositeIds(
      override,
      id,
      componentId
    );

    return this.services.biz.component.updateComponentAnalytic(
      override,
      componentId,
      payload
    );
  }

  async deleteById(override: UserQuery | undefined, id: string) {
    // ensure dashboard exists
    await this.getOneById(override, id);

    await this.services.dao.dashboard.transaction(async (transaction) => {
      const dashboardComponents =
        await this.services.dao.dashboardComponent.findAllByDashboardId(id);
      await this.services.dao.dashboardComponent.deleteByDashboardId(id, {
        transaction,
      });

      const componentIds = dashboardComponents.map(
        ({ componentId }) => componentId
      );
      await this.services.biz.component.deleteByIds(override, componentIds, {
        transaction,
      });

      await this.services.dao.dashboard.deleteById({}, id, { transaction });
    });

    return;
  }

  async removeComponent(
    override: UserQuery | undefined,
    id: string,
    componentId: string
  ) {
    // ensure dashboard exists
    await this.getOneById(override, id);

    await this.services.dao.dashboardComponent.transaction(
      async (transaction) => {
        // TODO create typed resource errors
        await this.getOneDashboardComponentByCompositeIds(
          override,
          id,
          componentId
        );

        await this.services.dao.dashboardComponent.deleteByCompositeIds(
          id,
          componentId,
          {
            transaction,
          }
        );

        await this.services.biz.component.deleteById(override, componentId, {
          transaction,
        });
      }
    );

    return;
  }
}
