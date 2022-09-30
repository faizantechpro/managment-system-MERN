import { PrimaryKey } from '../types/items';
import { Role, User, Permission } from '../database';
import { RolesModel } from '../database/models/role';
import { PermissionAttributes } from '../database/models/permission';
import { Op, WhereOptions } from 'sequelize';
import { UserContext } from 'lib/middlewares/openapi';
import ContextQuery from './utils/ContextQuery';
import { InvalidPayload } from 'lib/middlewares/exception';

type RoleUserInfo = {
  userId: PrimaryKey;
  roleId: string;
};

abstract class RoleService extends ContextQuery<RolesModel> {
  async updateRoleUser(props: RoleUserInfo) {
    const { roleId, userId } = props;
    await User.update(
      {
        role: roleId,
      },
      {
        where: { id: userId },
      }
    );

    return { ...props };
  }

  async getPermissions(roleId: string) {
    const data = await Permission.findAndCountAll({
      where: { role: roleId },
    });

    return data.rows;
  }

  async createOrDeletePermission(
    role: string,
    permission: { collection: string; action: string; fields: string }
  ) {
    const { collection, action, fields } = permission;
    const permissionsFound = await Permission.findAll({
      where: {
        role,
        collection,
        action,
        ...this.getContextQuery(),
      },
    });

    await Promise.all(
      permissionsFound.map((item) => {
        return item.destroy();
      })
    );

    if (fields) {
      const newPermission: Omit<PermissionAttributes, 'id'> = {
        role,
        collection,
        action,
        fields,
        tenant_id: this.user.tenant,
      };
      await Permission.create(newPermission);
    }

    return { role, permission };
  }

  async createPermission(
    role: string,
    collection: string,
    action: string,
    fields: string
  ) {
    const newPermission: Omit<PermissionAttributes, 'id'> = {
      role,
      collection,
      action,
      fields,
      tenant_id: this.user.tenant,
    };

    const permissionExist = await Permission.findOne({
      where: { role, collection, action },
    });

    if (permissionExist) {
      return await Permission.update(
        {
          role,
          collection,
          action,
          fields,
        },
        {
          where: { id: permissionExist.id, ...this.getContextQuery() },
        }
      );
    }

    return await Permission.create(newPermission);
  }
}

export class AdminRoleService extends RoleService {
  getContextQuery() {
    return {};
  }
}

export class OwnerRoleService extends RoleService {
  getContextQuery() {
    // If user is owner than fetch roles related to his tenant and default role.
    // Role which do not have tenant id will be considered default role.
    return {
      tenant_id: {
        [Op.or]: [this.user.tenant, null],
      },
    };
  }
}

export class UserRoleService extends RoleService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export function roleServiceFactory(user = {} as UserContext) {
  if (user?.auth?.isAdmin) {
    return new AdminRoleService(Role, user);
  } else if (user?.auth?.isOwner) {
    return new OwnerRoleService(Role, user);
  }

  return new UserRoleService(Role, user);
}
