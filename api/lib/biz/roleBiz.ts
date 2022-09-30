import { Pagination } from 'lib/dao';
import {
  RoleCreateBiz,
  RoleModifyBiz,
  RoleQueryBiz,
} from 'lib/middlewares/sequelize';
import { Biz } from './utils';
import { TenantQuery } from './utils/ContextQuery';

export class RoleBiz extends Biz {
  async get(
    override: TenantQuery | undefined,
    pagination: Pagination,
    query: RoleQueryBiz
  ) {
    const context = await this.userQuery.build(override);

    return this.services.dao.role.find(context, pagination, query);
  }

  async getOneById(override: TenantQuery | undefined, id: string) {
    const context = await this.userQuery.build(override);

    const role = await this.services.dao.role.findOneById(context, id);
    if (!role) {
      throw new this.exception.ResourceNotFound('role');
    }
    return role;
  }

  async create(override: TenantQuery | undefined, payload: RoleCreateBiz) {
    const context = await this.tenantQuery.build(override);

    return this.services.dao.role.create({
      ...payload,
      admin_access: false,
      owner_access: false,
      enforce_tfa: false,
      tenant_id: context.tenantId,
    });
  }

  async updateById(
    override: TenantQuery | undefined,
    id: string,
    payload: RoleModifyBiz
  ) {
    const context = await this.userQuery.build(override);

    if (
      (payload.owner_access &&
        !this.user.auth.isAdmin &&
        !this.user.auth.isOwner) ||
      (payload.admin_access && !this.user.auth.isAdmin)
    ) {
      throw new this.exception.Forbidden('Unauthorized to update role');
    }

    const role = await this.services.dao.role.updateById(context, id, payload);
    if (!role) {
      throw new this.exception.ResourceNotFound('role');
    }
    return role;
  }

  async deleteById(override: TenantQuery | undefined, id: string) {
    // existence check
    await this.getOneById(override, id);

    const context = await this.userQuery.build(override);

    const usersWithRole = await this.services.dao.user.findByRole({}, id, {
      limit: 1,
      page: 1,
    });
    if (usersWithRole.data.length > 0) {
      throw new this.exception.Conflict('Role is assigned to user');
    }

    await this.services.dao.role.deleteById(context, id);

    return;
  }
}
