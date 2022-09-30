import {
  generateResponseSchema,
  operationMiddleware,
  responses,
  generateErrorResponseSchema,
  apiSchemas,
  generateRequestBody,
  generateEmptyResponseSchema,
} from 'lib/middlewares/openapi';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { permissions } from 'lib/utils/permissions';

const contactPermissions = permissions.contacts;

export const PUT = operationMiddleware(
  'updateLabel',
  {
    operationId: 'updateLabel',
    summary: 'Update label',
    tags: ['labels'],
    security: [{ Bearer: [] }],
    requestBody: generateRequestBody(apiSchemas.LabelModifyBiz),
    responses: {
      200: generateEmptyResponseSchema(),
      403: generateErrorResponseSchema({
        description: 'Unauthorized',
        errors: [
          {
            title: 'Unauthorized',
          },
        ],
      }),
      404: responses.notFound.generate('Label'),
    },
  },

  permissionsValidator(contactPermissions.edit) as any,
  async (req, res) => {
    const {
      params: { label_id },
      body,
    } = req;

    try {
      await req.services.biz.label.updateById(undefined, label_id, body);

      return res.success({});
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Label not found' });
      }
      if (error instanceof req.exception.Forbidden) {
        return res.error(error.status, { error: 'Unauthorized' });
      }
      throw error;
    }
  }
);

export const DELETE = operationMiddleware(
  'removeLabels',
  {
    operationId: 'removeLabels',
    summary: 'Delete label',
    tags: ['labels'],
    security: [{ Bearer: [] }],
    responses: {
      200: generateResponseSchema({}),
      404: responses.notFound.generate('Label'),
    },
  },

  async (req, res) => {
    const {
      params: { label_id },
    } = req;

    try {
      await req.services.biz.label.deleteById(undefined, label_id);

      return res.success({});
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Label not found' });
      }
      throw error;
    }
  }
);
