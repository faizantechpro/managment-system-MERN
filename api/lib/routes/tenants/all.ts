import {
  generateResponseSchema,
  operationMiddleware,
  schemas,
} from 'lib/middlewares/openapi';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { TenantService } from 'lib/services';

export const GET = operationMiddleware(
  'getAllTenants',
  {
    operationId: 'getAllTenants',
    summary: 'Get all Tenants',
    tags: ['tenants'],
    security: [{ Bearer: [] }],
    parameters: [],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['pagination'],
        properties: {
          data: {
            type: 'array',
            items: {},
          },
          pagination: schemas.paginationResponse,
        },
      }),
    },
  },
  permissionsValidator() as any,
  async (req, res) => {
    const { limit, page, search } = req.query;

    const pagination = {
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      search,
    };

    const tenants = await TenantService.getAllTenants(pagination);

    return res.success(tenants);
  }
);
