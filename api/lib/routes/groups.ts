import {
  apiSchemas,
  generatePaginatedResponseSchema,
  generateRequestBody,
  generateResponseSchema,
  queries,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getGroups',
  {
    operationId: 'getGroups',
    summary: 'Get Groups',
    tags: ['groups'],
    security: [{ Bearer: [] }],
    parameters: [...queries.pagination],
    responses: {
      200: generatePaginatedResponseSchema(apiSchemas.GroupAttr),
    },
  },

  async (req, res) => {
    const { query } = req;

    const groups = await req.services.biz.group.get(undefined, query);

    await res.success(groups);
    return;
  }
);

export const POST = operationMiddleware(
  'createGroup',
  {
    operationId: 'createGroup',
    summary: 'Create Group',
    tags: ['groups'],
    security: [{ Bearer: [] }],
    parameters: [],
    requestBody: generateRequestBody(apiSchemas.GroupCreateBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.GroupAttr),
    },
  },

  async (req, res) => {
    const { body } = req;

    const group = await req.services.biz.group.create(undefined, body);

    await res.success(group);
    return;
  }
);
