import {
  generateResponseSchema,
  operationMiddleware,
} from 'lib/middlewares/openapi';
import { organizationServiceFactory } from 'lib/services';

export const GET = operationMiddleware(
  'getRelations',
  {
    operationId: 'getRelations',
    summary: 'Get contacts and deals relations',
    tags: ['contacts', 'deals'],
    security: [{ Bearer: [] }],
    parameters: [
      {
        in: 'query',
        name: 'ids',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['relations'],
        properties: {
          relations: {
            type: 'object',
            required: ['contacts', 'deals'],
            properties: {
              contacts: {
                type: 'number',
              },
              deals: {
                type: 'number',
              },
            },
          },
        },
      }),
    },
  },

  async (req, res) => {
    const { ids } = req.query;

    const service = organizationServiceFactory(req.user);
    const relations = await service.getRelations(ids.split(','));

    return res.json({ relations });
  }
);
