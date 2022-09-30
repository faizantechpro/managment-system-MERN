import {
  apiSchemas,
  generateErrorResponseSchema,
  generateRequestBody,
  generateResponseSchema,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getRole',
  {
    operationId: 'getRole',
    summary: 'Get Role',
    tags: ['roles'],
    security: [{ Bearer: [] }],
    parameters: [parameters.roleId],
    responses: {
      200: generateResponseSchema(apiSchemas.RoleAttr),
      404: responses.notFound.generate('Role'),
    },
  },

  permissionsValidator() as any,
  async (req, res) => {
    const {
      params: { roleId },
    } = req;

    try {
      const role = await req.services.biz.role.getOneById(undefined, roleId);

      await res.success(role);
      return;
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Role not found' });
      }
      throw error;
    }
  }
);

export const PUT = operationMiddleware(
  'updateRole',
  {
    operationId: 'updateRole',
    summary: 'Update Role',
    tags: ['roles'],
    security: [{ Bearer: [] }],
    parameters: [parameters.roleId],
    requestBody: generateRequestBody({
      allOf: [
        apiSchemas.RoleModifyBiz,
        {
          properties: {
            isAdmin: {
              description: 'Use admin_access',
              type: 'boolean',
              deprecated: true,
            },
            isOwner: {
              description: 'Use owner_access',
              type: 'boolean',
              deprecated: true,
            },
          },
        },
      ],
    }),
    responses: {
      200: generateResponseSchema(apiSchemas.RoleAttr),
      403: generateErrorResponseSchema({
        description: 'Forbidden',
        errors: [{ title: 'Unauthorized to update role' }],
      }),
      404: responses.notFound.generate('Role'),
    },
  },

  permissionsValidator() as any,
  async (req, res) => {
    const {
      body,
      params: { roleId },
    } = req;

    try {
      const role = await req.services.biz.role.updateById(undefined, roleId, {
        ...body,
        admin_access: body.admin_access || body.isAdmin,
        owner_access: body.owner_access || body.isOwner,
      });

      await res.success(role);
      return;
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Role not found' });
      }
      if (error instanceof req.exception.Forbidden) {
        return res.error(error.status, {
          error: 'Unauthorized to update role',
        });
      }

      throw error;
    }
  }
);

export const DELETE = operationMiddleware(
  'deleteRole',
  {
    operationId: 'deleteRole',
    summary: 'Delete Role',
    tags: ['roles'],
    security: [{ Bearer: [] }],
    parameters: [parameters.roleId],
    responses: {
      200: generateResponseSchema({}),
      404: responses.notFound.generate('Role'),
      409: generateErrorResponseSchema({
        description: 'Conflict',
        errors: [{ title: 'Role is assigned to user' }],
      }),
    },
  },

  permissionsValidator() as any,
  async (req, res) => {
    const {
      params: { roleId },
    } = req;

    try {
      await req.services.biz.role.deleteById(undefined, roleId);

      await res.success({});
      return;
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Role not found' });
      }
      if (error instanceof req.exception.Conflict) {
        return res.error(error.status, {
          error: 'Role is assigned to user',
        });
      }

      throw error;
    }
  }
);
