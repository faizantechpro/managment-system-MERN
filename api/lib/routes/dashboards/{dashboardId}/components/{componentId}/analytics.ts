import {
  apiSchemas,
  generateRequestBody,
  generateResponseSchema,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const PUT = operationMiddleware(
  'updateDashboardComponentAnalytic',
  {
    operationId: 'updateDashboardComponentAnalytic',
    summary: 'Update Dashboard Component Analytic',
    tags: ['dashboards', 'components', 'analytics'],
    security: [{ Bearer: [] }],
    parameters: [parameters.dashboardId, parameters.componentId],
    requestBody: generateRequestBody(apiSchemas.AnalyticModifyBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.AnalyticAttr),
      404: responses.notFound.generate('Dashboard', 'Component', 'Analytic'),
    },
  },

  async (req, res) => {
    const {
      params: { componentId, dashboardId },
      body,
    } = req;

    try {
      const updatedAnalytic =
        await req.services.biz.dashboard.updateComponentAnalytic(
          undefined,
          dashboardId,
          componentId,
          body
        );

      await res.success(updatedAnalytic);
      return;
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Dashboard not found' });
      }
      throw error;
    }
  }
);
