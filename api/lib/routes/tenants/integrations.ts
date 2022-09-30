import {
  generateResponseSchema,
  queries,
  schemas,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getIntegrations',
  {
    operationId: 'getIntegrations',
    summary: 'Get Integrations',
    tags: ['tenants', 'integrations'],
    security: [{ Bearer: [] }],
    parameters: [
      ...queries.pagination,
      {
        in: 'query',
        name: 'tenant_id',
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['pagination', 'data'],
        properties: {
          pagination: schemas.paginationResponse,
          data: {
            type: 'array',
            items: schemas.tenantIntegration,
          },
        },
      }),
    },
  },

  async (req, res) => {
    const {
      query: { tenant_id, ...pagination },
    } = req;

    const integrations = await req.services.biz.tenantIntegration.find(
      { tenantId: tenant_id },
      pagination
    );

    return res.success(integrations);
  }
);
