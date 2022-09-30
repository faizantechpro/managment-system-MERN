import { Router } from 'express';

import { roleServiceFactory } from '../services';
import asyncHandler from '../utils/async-handler';
import { permissionsValidator } from 'lib/middlewares/permissions';

const router = Router();
const path = '/roles';

// Update role inside user
router.put(
  `${path}/user/:userId`,
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const { roleId } = req.body;
    const userId = req.params.userId;
    const roleService = roleServiceFactory(req.user);

    const roleUserUpdated = await roleService.updateRoleUser({
      userId,
      roleId,
    });

    return res.json(roleUserUpdated);
  })
);

// Get permissions by role id
router.get(
  `${path}/permissions/:roleId`,
  asyncHandler(async (req, res) => {
    const roleService = roleServiceFactory(req.user);
    const permissions = await roleService.getPermissions(req.params.roleId);

    if (!permissions) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    res.json(permissions);
  })
);

// Create/Update Permissions
router.post(
  `${path}/permissions/`,
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const permissions = req.body.permissions || {};
    const role = req.body.role || {};
    const results: any = [];

    permissions.forEach(async (permission: any) => {
      const { collection, action, fields } = permission || {};
      const roleService = roleServiceFactory(req.user);

      await roleService
        .createPermission(role, collection, action, fields)
        .then((response) => response)
        .catch((err) => {
          console.log(err);
        });
    });

    res.json(results);
  })
);

router.put(
  `${path}/:roleId/permissions`,
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const { roleId } = req.params;
    const permission = req.body.permissions || {};

    const roleService = roleServiceFactory(req.user);
    const result = await roleService.createOrDeletePermission(
      roleId,
      permission
    );
    res.json(result);
  })
);

export default router;
