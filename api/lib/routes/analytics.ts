import { apiSchemas, generateResponseSchema } from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getAnalytics',
  {
    operationId: 'getAnalytics',
    summary: 'Get Analytics',
    tags: ['analytics'],
    security: [{ Bearer: [] }],
    parameters: [
      {
        in: 'query',
        name: 'type',
        required: false,
        schema: apiSchemas.AnalyticType,
      },
      {
        in: 'query',
        name: 'isPublic',
        required: false,
        schema: {
          type: 'boolean',
          default: true,
        },
      },
    ],
    responses: {
      200: generateResponseSchema({
        type: 'array',
        items: apiSchemas.AnalyticAttr,
      }),
    },
  },
  async (req, res) => {
    // for now, only return all public

    const publicAnalytics = await req.services.biz.analytic.getAllPublic(
      req.query
    );

    await res.success(publicAnalytics);
  }
);
