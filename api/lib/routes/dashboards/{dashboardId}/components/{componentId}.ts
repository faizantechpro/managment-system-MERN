import {
  apiSchemas,
  generateEmptyResponseSchema,
  generateRequestBody,
  generateResponseSchema,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const PUT = operationMiddleware(
  'updateDashboardComponent',
  {
    operationId: 'updateDashboardComponent',
    summary: 'Update Dashboard Component',
    tags: ['dashboards', 'components'],
    security: [{ Bearer: [] }],
    parameters: [parameters.dashboardId, parameters.componentId],
    requestBody: generateRequestBody(apiSchemas.DashboardModifyComponentBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.DashboardComponentModifiedBiz),
      404: responses.notFound.generate('Dashboard'),
    },
  },
  async (req, res) => {
    const {
      params: { dashboardId, componentId },
      body,
    } = req;

    try {
      const updated = await req.services.biz.dashboard.updateComponent(
        undefined,
        dashboardId,
        componentId,
        body
      );

      await res.success(updated);
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Dashboard not found' });
      }
      throw error;
    }
  }
);

export const DELETE = operationMiddleware(
  'deleteDashboardComponent',
  {
    operationId: 'deleteDashboardComponent',
    summary: 'Get Dashboard',
    tags: ['dashboards', 'components'],
    security: [{ Bearer: [] }],
    parameters: [parameters.dashboardId, parameters.componentId],
    responses: {
      200: generateEmptyResponseSchema(),
      404: responses.notFound.generate('Dashboard', 'Component'),
    },
  },
  async (req, res) => {
    const {
      params: { dashboardId, componentId },
    } = req;

    try {
      await req.services.biz.dashboard.removeComponent(
        undefined,
        dashboardId,
        componentId
      );

      await res.success({});
      return;
    } catch (error) {
      // TODO component or dashboard may not exist
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Dashboard not found' });
      }
      throw error;
    }
  }
);
