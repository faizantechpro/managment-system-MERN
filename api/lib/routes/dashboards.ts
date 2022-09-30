import {
  apiSchemas,
  generatePaginatedResponseSchema,
  generateRequestBody,
  generateResponseSchema,
  queries,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getDashboards',
  {
    operationId: 'getDashboards',
    summary: 'Get Dashboards',
    tags: ['dashboards'],
    security: [{ Bearer: [] }],
    parameters: [...queries.pagination],
    responses: {
      200: generatePaginatedResponseSchema(apiSchemas.DashboardAttr),
    },
  },
  async (req, res) => {
    const { query } = req;

    const dashboards = await req.services.biz.dashboard.get(undefined, query);

    await res.success(dashboards);
  }
);

export const POST = operationMiddleware(
  'createDashboard',
  {
    operationId: 'createDashboard',
    summary: 'Create Dashboard',
    tags: ['dashboards'],
    security: [{ Bearer: [] }],
    parameters: [],
    requestBody: generateRequestBody(apiSchemas.DashboardCreateBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.DashboardAttr),
    },
  },
  async (req, res) => {
    const { body } = req;

    const dashboard = await req.services.biz.dashboard.create(undefined, body);

    await res.success(dashboard);
  }
);
