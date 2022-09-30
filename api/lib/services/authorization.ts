import { roleServiceFactory } from './role';
import { Permission } from '../types/permissions';
import { AuthUser } from 'lib/middlewares/auth';
import { Forbidden } from 'lib/middlewares/exception';

export class AuthorizationService {
  static isAdmin(user: AuthUser) {
    // this should return HTTP status code 403
    if (!user.admin && !user.owner) {
      throw new Forbidden();
    }
  }

  static async validatePermissions(
    userRoleId: string,
    permissions?: Permission
  ): Promise<boolean> {
    if (!permissions?.collection || !permissions?.action) return false;

    const roleService = roleServiceFactory();
    const rolePermissions = await roleService.getPermissions(userRoleId);

    if (!rolePermissions) return false;

    const permissionResults = rolePermissions.filter(
      (permission) =>
        permission.collection === permissions?.collection &&
        permission.action === permissions.action &&
        permission.fields
    );

    return permissionResults.length > 0;
  }
}
