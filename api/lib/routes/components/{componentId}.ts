import {
  apiSchemas,
  generateRequestBody,
  generateResponseSchema,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getComponent',
  {
    operationId: 'getComponent',
    summary: 'Get Component',
    tags: ['components'],
    security: [{ Bearer: [] }],
    parameters: [parameters.componentId],
    responses: {
      200: generateResponseSchema(apiSchemas.ComponentAttr),
      404: responses.notFound.generate('Component'),
    },
  },
  async (req, res) => {
    const {
      params: { componentId },
    } = req;

    try {
      const component = await req.services.biz.component.getOneById(
        undefined,
        componentId
      );

      await res.success(component);
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Component not found' });
      }
      throw error;
    }
  }
);

export const PUT = operationMiddleware(
  'updateComponent',
  {
    operationId: 'updateComponent',
    summary: 'Update Component',
    tags: ['components'],
    security: [{ Bearer: [] }],
    parameters: [parameters.componentId],
    requestBody: generateRequestBody(apiSchemas.ComponentModifyBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.ComponentAttr),
      404: responses.notFound.generate('Component'),
    },
  },
  async (req, res) => {
    const {
      params: { componentId },
      body,
    } = req;

    try {
      const component = await req.services.biz.component.updateById(
        undefined,
        componentId,
        body
      );

      await res.success(component);
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Component not found' });
      }
      throw error;
    }
  }
);
