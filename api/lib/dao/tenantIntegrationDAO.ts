import {
  TenantIntegrationCreateDAO,
  TenantIntegrationModifyDAO,
  TenantIntegrationType,
} from 'lib/middlewares/sequelize';
import { Pagination } from './utils';
import DAO from './utils/DAO';

export class TenantIntegrationDAO extends DAO<'TenantIntegrationDB'> {
  async find(
    query: {
      tenantId?: string;
    } = {},
    pagination: Pagination
  ) {
    const builder = this.where();
    builder.context(query);

    const { count, rows } = await this.repo.findAndCountAll({
      where: builder.build(),
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(this.rowsToJSON(rows), count, pagination);
  }

  async findOneByType(tenant_id: string, type: TenantIntegrationType) {
    const integration = await this.repo.findOne({
      where: {
        tenant_id,
        type,
      },
    });
    if (!integration) {
      return;
    }

    return this.toJSON(integration);
  }

  async create(payload: TenantIntegrationCreateDAO) {
    const integration = await this.repo.create(payload, {
      returning: true,
    });

    return this.toJSON(integration)!;
  }

  async updateByType(
    tenant_id: string,
    type: TenantIntegrationType,
    payload: TenantIntegrationModifyDAO
  ) {
    const [, integration] = await this.repo.update(payload, {
      where: {
        tenant_id,
        type,
      },
      returning: true,
    });

    if (integration.length > 0) {
      return this.toJSON(integration[0]);
    }

    return;
  }

  async deleteByType(tenant_id: string, type: TenantIntegrationType) {
    const totalDeleted = await this.repo.destroy({
      where: {
        tenant_id,
        type,
      },
    });

    return totalDeleted;
  }
}
