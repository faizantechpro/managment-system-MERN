import {
  apiSchemas,
  generateResponseSchema,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getAnalytic',
  {
    operationId: 'getAnalytic',
    summary: 'Get Analytic',
    tags: ['analytics'],
    security: [{ Bearer: [] }],
    parameters: [parameters.analyticId],
    responses: {
      200: generateResponseSchema(apiSchemas.AnalyticAttr),
      404: responses.notFound.generate('Analytic'),
    },
  },
  async (req, res) => {
    const {
      params: { analyticId },
    } = req;

    try {
      const analytic = await req.services.biz.analytic.getOneById(
        undefined,
        analyticId
      );

      await res.success(analytic);
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Analytic not found' });
      }
      throw error;
    }
  }
);
