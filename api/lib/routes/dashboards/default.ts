import {
  apiSchemas,
  generateResponseSchema,
  queries,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const POST = operationMiddleware(
  'createDefaultDashboards',
  {
    operationId: 'createDefaultDashboards',
    summary: 'Create Default Dashboards',
    description:
      'Creates a default dashboards for the tenant you are logged in for.',
    tags: ['dashboards'],
    security: [{ Bearer: [] }],
    parameters: [queries.tenantId],
    responses: {
      200: generateResponseSchema({
        type: 'array',
        items: apiSchemas.DashboardAttr,
      }),
    },
  },

  async (req, res) => {
    const {
      query: { tenantId },
    } = req;

    try {
      const dashboards = await req.services.biz.dashboard.createDefault({
        tenantId,
      });

      await res.success(dashboards);
      return;
    } catch (error) {
      throw error;
    }
  }
);
