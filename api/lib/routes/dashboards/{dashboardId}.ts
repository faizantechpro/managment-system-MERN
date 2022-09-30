import {
  apiSchemas,
  generateRequestBody,
  generateResponseSchema,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getDashboard',
  {
    operationId: 'getDashboard',
    summary: 'Get Dashboard',
    tags: ['dashboards'],
    security: [{ Bearer: [] }],
    parameters: [parameters.dashboardId],
    responses: {
      200: generateResponseSchema(apiSchemas.DashboardAttr),
      404: responses.notFound.generate('Dashboard'),
    },
  },
  async (req, res) => {
    const {
      params: { dashboardId },
    } = req;

    try {
      const dashboard = await req.services.biz.dashboard.getOneById(
        undefined,
        dashboardId
      );

      await res.success(dashboard);
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Dashboard not found' });
      }
      throw error;
    }
  }
);

export const PUT = operationMiddleware(
  'updateDashboard',
  {
    operationId: 'updateDashboard',
    summary: 'Update Dashboard',
    tags: ['dashboards'],
    security: [{ Bearer: [] }],
    parameters: [parameters.dashboardId],
    requestBody: generateRequestBody(apiSchemas.DashboardModifyBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.DashboardAttr),
      404: responses.notFound.generate('Dashboard'),
    },
  },
  async (req, res) => {
    const {
      body,
      params: { dashboardId },
    } = req;

    try {
      const dashboard = await req.services.biz.dashboard.updateById(
        undefined,
        dashboardId,
        body
      );

      await res.success(dashboard);
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Dashboard not found' });
      }
      throw error;
    }
  }
);

export const DELETE = operationMiddleware(
  'deleteDashboard',
  {
    operationId: 'deleteDashboard',
    summary: 'Delete Dashboard',
    tags: ['dashboards'],
    security: [{ Bearer: [] }],
    parameters: [parameters.dashboardId],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        properties: {},
      }),
      404: responses.notFound.generate('Dashboard'),
    },
  },
  async (req, res) => {
    const {
      params: { dashboardId },
    } = req;

    try {
      await req.services.biz.dashboard.deleteById(undefined, dashboardId);

      await res.success({});
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Dashboard not found' });
      }
      throw error;
    }
  }
);
