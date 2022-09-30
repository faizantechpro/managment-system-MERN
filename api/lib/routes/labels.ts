import {
  apiSchemas,
  generateErrorResponseSchema,
  generateQueryParam,
  generateRequestBody,
  generateResponseSchema,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getLabels',
  {
    operationId: 'getLabels',
    summary: 'Get Labels',
    tags: ['labels'],
    security: [{ Bearer: [] }],
    parameters: [generateQueryParam('type', true, apiSchemas.LabelType)],
    responses: {
      200: generateResponseSchema({
        type: 'array',
        items: apiSchemas.LabelAttr,
      }),
    },
  },

  async (req, res) => {
    const {
      query: { type },
    } = req;

    const labels = await req.services.biz.label.getAllByType(undefined, type);

    return res.success(labels);
  }
);

export const POST = operationMiddleware(
  'createLabel',
  {
    operationId: 'createLabel',
    summary: 'Create Label',
    tags: ['labels'],
    security: [{ Bearer: [] }],
    requestBody: generateRequestBody(apiSchemas.LabelCreateBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.LabelAttr),
      409: generateErrorResponseSchema({
        description: 'Conflict',
        errors: [{ title: 'Label already exists' }],
      }),
    },
  },

  async (req, res) => {
    const { body } = req;

    try {
      const label = await req.services.biz.label.create(undefined, body);

      return res.success(label);
    } catch (error) {
      if (error instanceof req.exception.Conflict) {
        return res.error(error.status, { error: 'Label already exists' });
      }

      throw error;
    }
  }
);
