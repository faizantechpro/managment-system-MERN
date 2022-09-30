import {
  apiSchemas,
  generatePaginatedResponseSchema,
  generateRequestBody,
  generateResponseSchema,
  parameters,
  queries,
  responses,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getDashboardComponents',
  {
    operationId: 'getDashboardComponents',
    summary: 'Get Dashboard Components',
    tags: ['dashboards', 'components'],
    security: [{ Bearer: [] }],
    parameters: [parameters.dashboardId, ...queries.pagination],
    responses: {
      200: generatePaginatedResponseSchema(apiSchemas.GetDashboardComponents),
      404: responses.notFound.generate('Dashboard'),
    },
  },
  async (req, res) => {
    const {
      params: { dashboardId },
      query: { page, limit, ...query },
    } = req;

    try {
      const components = await req.services.biz.dashboard.getComponentsById(
        undefined,
        dashboardId,
        { limit, page },
        query
      );

      await res.success(components);
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Dashboard not found' });
      }
      throw error;
    }
  }
);

export const POST = operationMiddleware(
  'createDashboardComponent',
  {
    operationId: 'createDashboardComponent',
    summary: 'Create Dashboard Component',
    tags: ['components', 'dashboards'],
    security: [{ Bearer: [] }],
    parameters: [parameters.dashboardId],
    requestBody: generateRequestBody(apiSchemas.DashboardAddComponentBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.ComponentAttr),
      404: responses.notFound.generate('Dashboard'),
    },
  },
  async (req, res) => {
    const {
      params: { dashboardId },
      body,
    } = req;

    try {
      const component = await req.services.biz.dashboard.addComponent(
        undefined,
        dashboardId,
        body
      );

      await res.success(component);
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Dashboard not found' });
      }
      throw error;
    }
  }
);
