import {
  apiSchemas,
  generateEmptyResponseSchema,
  generateQueryParam,
  generateRequestBody,
  generateResponseSchema,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getGroup',
  {
    operationId: 'getGroup',
    summary: 'Get Group',
    tags: ['groups'],
    security: [{ Bearer: [] }],
    parameters: [parameters.groupId],
    responses: {
      200: generateResponseSchema(apiSchemas.GroupAttr),
      404: responses.notFound.generate('Group'),
    },
  },

  async (req, res) => {
    const {
      params: { groupId },
    } = req;

    try {
      const group = await req.services.biz.group.getOneById(undefined, groupId);

      await res.success(group);
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Group not found' });
      }
      throw error;
    }
  }
);

export const PUT = operationMiddleware(
  'updateGroup',
  {
    operationId: 'updateGroup',
    summary: 'Update Group',
    tags: ['groups'],
    security: [{ Bearer: [] }],
    parameters: [parameters.groupId],
    requestBody: generateRequestBody(apiSchemas.GroupModifyBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.GroupAttr),
      404: responses.notFound.generate('Group'),
    },
  },

  async (req, res) => {
    const {
      params: { groupId },
      body,
    } = req;

    try {
      const group = await req.services.biz.group.updateById(
        undefined,
        groupId,
        body
      );

      await res.success(group);
      return;
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Group not found' });
      }
      throw error;
    }
  }
);

export const DELETE = operationMiddleware(
  'deleteGroup',
  {
    operationId: 'deleteGroup',
    summary: 'Delete Group',
    tags: ['groups'],
    security: [{ Bearer: [] }],
    parameters: [
      parameters.groupId,
      generateQueryParam('transferId', true, {
        type: 'string',
        format: 'uuid',
      }),
    ],
    responses: {
      200: generateEmptyResponseSchema(),
      404: responses.notFound.generate('Group'),
    },
  },

  permissionsValidator() as any,
  async (req, res) => {
    const {
      params: { groupId },
      query: { transferId },
    } = req;

    try {
      await req.services.biz.group.deleteById(undefined, groupId, transferId);

      await res.success({});
      return;
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Group not found' });
      }
      throw error;
    }
  }
);
