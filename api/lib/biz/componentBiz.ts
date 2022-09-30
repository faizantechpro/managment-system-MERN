import {
  AnalyticAttr,
  AnalyticModifyBiz,
  ComponentCreateWithAnalyticBiz,
  ComponentModifyBiz,
} from 'lib/middlewares/sequelize';
import { Transaction, TransactionOptions } from 'sequelize';
import { Biz } from './utils';
import { UserQuery } from './utils/ContextQuery';

export class ComponentBiz extends Biz {
  async getOneById(override: UserQuery | undefined, id: string) {
    const context = await this.userQuery.build(override);

    const component = await this.services.dao.component.findOneById(
      context,
      id
    );
    if (!component) {
      throw new this.exception.ResourceNotFound('component');
    }
    return component;
  }

  async createComponentWithAnalytic(
    override: UserQuery | undefined,
    payload: ComponentCreateWithAnalyticBiz,
    opts: TransactionOptions = {}
  ) {
    const [userContext, tenantContext] = await Promise.all([
      this.userQuery.build(override),
      this.tenantQuery.build(override),
    ]);

    return this.services.dao.component.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
        ...opts,
      },
      async (transaction) => {
        let analytic: AnalyticAttr | undefined;
        if (!('analytic' in payload)) {
          analytic = await this.services.dao.analytic.findOneById(
            userContext,
            payload.component.analyticId
          );
          if (!analytic) {
            throw new this.exception.ResourceNotFound('analytic');
          }
        } else {
          analytic = await this.services.dao.analytic.create(
            {
              ...payload.analytic,
              createdById: this.user.id,
              tenantId: tenantContext.tenantId,
            },
            { transaction }
          );
        }

        return this.services.dao.component.create(
          {
            ...payload.component,
            analyticId: analytic.id,
            createdById: this.user.id,
            tenantId: tenantContext.tenantId,
          },
          { transaction }
        );
      }
    );
  }

  async updateById(
    override: UserQuery | undefined,
    id: string,
    payload: ComponentModifyBiz,
    opts: TransactionOptions = {}
  ) {
    const context = await this.userQuery.build(override);

    // ensure component exists
    await this.getOneById(override, id);

    const component = await this.services.dao.component.updateById(
      context,
      id,
      payload,
      opts
    );

    return component!;
  }

  async updateComponentAnalytic(
    override: UserQuery | undefined,
    componentId: string,
    payload: AnalyticModifyBiz
  ) {
    const component = await this.getOneById(override, componentId);

    const analytic = await this.services.biz.analytic.getOneById(
      override,
      component.analyticId
    );
    const isPublic = !analytic.tenantId && !analytic.createdById;

    // not public, custom made, simply update the analytic
    if (!isPublic) {
      return this.services.biz.analytic.updateById(
        override,
        component.analyticId,
        payload
      );
    }

    // component is pointed at public analytic, need to do the following:
    // 1. clone the public analytic with updated fields
    // 2. update the component to point at the new analytic
    return this.services.dao.component.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      },
      async (transaction) => {
        const [userContext, tenantContext] = await Promise.all([
          this.userQuery.build(override),
          this.tenantQuery.build(override),
        ]);

        const { id, createdAt, updatedAt, ...rest } = analytic;
        const analyticClone = {
          ...rest,
          ...payload,
          createdById: this.user.id,
          tenantId: tenantContext.tenantId,
        };

        const newAnalytic = await this.services.dao.analytic.create(
          analyticClone,
          { transaction }
        );
        await this.services.dao.component.updateById(
          userContext,
          componentId,
          {
            analyticId: newAnalytic.id,
          },
          { transaction }
        );

        return newAnalytic;
      }
    );
  }

  async deleteById(
    override: UserQuery | undefined,
    id: string,
    opts: TransactionOptions = {}
  ) {
    // ensure existence
    const component = await this.getOneById(override, id);

    return this.services.dao.component.transaction(
      opts,
      async (transaction) => {
        await this.services.dao.component.deleteById({}, id, {
          transaction,
        });

        await this.services.dao.analytic.deleteById({}, component.analyticId, {
          transaction,
        });
      }
    );
  }

  async deleteByIds(
    override: UserQuery | undefined,
    ids: string[],
    opts: TransactionOptions = {}
  ) {
    if (ids.length === 0) {
      return;
    }
    const context = await this.userQuery.build(override);

    return this.services.dao.component.transaction(
      opts,
      async (transaction) => {
        const components = await this.services.dao.component.findAllById(
          context,
          ids
        );

        const promises = [];

        // TODO determine whether a single component should be assignable to multiple dashboards
        if (components.length > 0) {
          promises.push(
            this.services.dao.component.deleteById(
              context,
              components.map(({ id }) => id),
              {
                transaction,
              }
            )
          );
        }

        const analyticIds = components.map(({ analyticId }) => analyticId);
        if (analyticIds.length > 0) {
          promises.push(
            this.services.dao.analytic.deleteById({}, analyticIds, {
              transaction,
            })
          );
        }

        await Promise.all(promises);
      }
    );
  }
}
