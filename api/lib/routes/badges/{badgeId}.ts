import {
  apiSchemas,
  generateEmptyResponseSchema,
  generateRequestBody,
  generateResponseSchema,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getBadge',
  {
    operationId: 'getBadge',
    summary: 'Get Badge',
    tags: ['badges'],
    security: [{ Bearer: [] }],
    parameters: [parameters.badgeId],
    responses: {
      200: generateResponseSchema(apiSchemas.BadgeAttr),
      404: responses.notFound.generate('Badge'),
    },
  },
  async (req, res) => {
    const {
      params: { badgeId },
    } = req;

    try {
      const badge = await req.services.biz.badge.getOneById(undefined, badgeId);

      return res.success(badge);
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Badge not found' });
      }
      throw error;
    }
  }
);

export const PUT = operationMiddleware(
  'updateBadge',
  {
    operationId: 'updateBadge',
    summary: 'Update Badge',
    tags: ['badges'],
    security: [{ Bearer: [] }],
    parameters: [parameters.badgeId],
    requestBody: generateRequestBody(apiSchemas.BadgeModifyBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.BadgeAttr),
      404: responses.notFound.generate('Badge'),
    },
  },
  async (req, res) => {
    const {
      params: { badgeId },
      body,
    } = req;

    try {
      const updatedBadge = await req.services.biz.badge.updateById(
        undefined,
        badgeId,
        body
      );

      await res.success(updatedBadge);
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Badge not found' });
      }
      throw error;
    }
  }
);

export const DELETE = operationMiddleware(
  'deleteBadge',
  {
    operationId: 'deleteBadge',
    summary: 'Delete Badge',
    tags: ['badges'],
    security: [{ Bearer: [] }],
    parameters: [parameters.badgeId],
    responses: {
      200: generateEmptyResponseSchema(),
      404: responses.notFound.generate('Badge'),
    },
  },

  permissionsValidator() as any,
  async (req, res) => {
    const {
      params: { badgeId },
    } = req;

    try {
      await req.services.biz.badge.deleteById(undefined, badgeId);

      await res.success({});
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Badge not found' });
      }
      throw error;
    }
  }
);
