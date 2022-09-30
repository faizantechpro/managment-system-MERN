import {
  apiSchemas,
  generateBulkQueryParam,
  generatePaginatedResponseSchema,
  generateRequestBody,
  generateResponseSchema,
  queries,
} from 'lib/middlewares/openapi';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getRoles',
  {
    operationId: 'getRoles',
    summary: 'Get Roles',
    tags: ['roles'],
    security: [{ Bearer: [] }],
    parameters: [
      ...queries.pagination,
      ...generateBulkQueryParam(apiSchemas.RoleQueryBiz),
    ],
    responses: {
      200: generatePaginatedResponseSchema(apiSchemas.RoleAttr),
    },
  },

  permissionsValidator() as any,
  async (req, res) => {
    const {
      query: { page, limit, order },
    } = req;

    const roles = await req.services.biz.role.get(
      undefined,
      { limit, page },
      { order }
    );

    await res.success(roles);
    return;
  }
);

export const POST = operationMiddleware(
  'createRole',
  {
    operationId: 'createRole',
    summary: 'Create Role',
    tags: ['roles'],
    security: [{ Bearer: [] }],
    requestBody: generateRequestBody(apiSchemas.RoleCreateBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.RoleAttr),
    },
  },

  permissionsValidator() as any,
  async (req, res) => {
    const { body } = req;

    const role = await req.services.biz.role.create(undefined, body);

    await res.success(role);
    return;
  }
);
