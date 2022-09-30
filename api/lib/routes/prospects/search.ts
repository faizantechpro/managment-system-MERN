import {
  generateResponseSchema,
  generateJSONBase,
  operationMiddleware,
} from 'lib/middlewares/openapi';
import { prospectFactory } from 'lib/services/prospects';

export const GET = operationMiddleware(
  'searchContacts',
  {
    operationId: 'searchContacts',
    summary: 'Search Contacts',
    tags: ['prospects'],
    security: [{ Bearer: [] }],
    parameters: [
      {
        in: 'query',
        name: 'name',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'employer',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'keyword',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'location',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'type',
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['data'],
        properties: {},
      }),
    },
  },

  async (req, res) => {
    const prospectService = prospectFactory();

    const result = await prospectService.search(req.query);

    if (result.error) {
      return res.status(400).json();
    }

    res.success({ data: result });
  }
);

export const POST = operationMiddleware(
  'searchQuery',
  {
    operationId: 'searchQuery',
    summary: 'Search Contacts by Query',
    tags: ['prospects'],
    security: [{ Bearer: [] }],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        properties: {
          query: {
            type: 'object',
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['data'],
        properties: {},
      }),
    },
  },

  async (req, res) => {
    const prospectService = prospectFactory();

    const result = await prospectService.search({ ...req.body });

    if (result.error) {
      return res.status(400).json();
    }

    res.success(result);
  }
);
