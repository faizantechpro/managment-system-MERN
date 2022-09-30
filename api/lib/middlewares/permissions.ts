import { Permission } from 'lib/types/permissions';
import { AuthorizationService } from 'lib/services/authorization';
import { RequestHandler } from 'express';
import { Forbidden } from './exception';

export const permissionsValidator = (permissions?: Permission) =>
  (async (req, res, next) => {
    try {
      // Admin validator
      const { isAdmin, isOwner } = req.user.auth;

      if (isAdmin || isOwner) return next();

      if (!permissions && !isAdmin && !isOwner) throw new Forbidden();

      const userRoleId = req.user.roles;

      // Permissions validator
      const hasPermissions = await AuthorizationService.validatePermissions(
        userRoleId,
        permissions
      );

      if (hasPermissions) return next();

      throw new Forbidden();
    } catch (err: any) {
      return res.status(err.status).json(err);
    }
  }) as RequestHandler;
