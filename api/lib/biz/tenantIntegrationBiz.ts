import { Pagination } from 'lib/dao';
import {
  TenantIntegrationAttr,
  TenantIntegrationModifyDAO,
  TenantIntegrationType,
} from 'lib/middlewares/sequelize';
import { Biz } from './utils';
import { TenantQuery } from './utils/ContextQuery';

type TenantIntegrationCreateBizAttr = {
  enabled: boolean;
  credentials: Omit<TenantIntegrationAttr['credentials'], 'url'>;
};

export class TenantIntegrationBiz extends Biz {
  protected defaults: { [K in TenantIntegrationType]: string } = {
    FISERV: 'https://prod.api.fiservapps.com',
  };

  async find(override: TenantQuery | undefined, pagination: Pagination) {
    const context = await this.query.build(override);

    return this.services.dao.tenantIntegration.find(context, pagination);
  }

  async findOneByType(
    override: TenantQuery | undefined,
    type: TenantIntegrationType
  ) {
    const context = await this.tenantQuery.build(override);

    return this.services.dao.tenantIntegration.findOneByType(
      context.tenantId,
      type
    );
  }

  async create(
    override: TenantQuery | undefined,
    type: TenantIntegrationType,
    payload: TenantIntegrationCreateBizAttr
  ) {
    if (!this.user.auth.isAdmin && !this.user.auth.isOwner) {
      throw new this.exception.Forbidden();
    }

    const context = await this.tenantQuery.build(override);

    const integration = await this.findOneByType(override, type);
    if (integration) {
      throw new this.exception.Conflict();
    }

    return this.services.dao.tenantIntegration.create({
      ...payload,
      type,
      credentials: {
        ...payload.credentials,
        url: this.defaults[type],
      },
      tenant_id: context.tenantId,
    });
  }

  async updateByType(
    override: TenantQuery | undefined,
    type: TenantIntegrationType,
    payload: TenantIntegrationModifyDAO
  ) {
    const context = await this.tenantQuery.build(override);

    return this.services.dao.tenantIntegration.updateByType(
      context.tenantId,
      type,
      payload
    );
  }

  async deleteByType(
    override: TenantQuery | undefined,
    type: TenantIntegrationType
  ) {
    const context = await this.tenantQuery.build(override);

    return this.services.dao.tenantIntegration.deleteByType(
      context.tenantId,
      type
    );
  }
}
