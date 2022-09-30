import {
  generateResponseSchema,
  operationMiddleware,
} from 'lib/middlewares/openapi';
import { prospectFactory } from 'lib/services/prospects';

export const GET = operationMiddleware(
  'contacts',
  {
    operationId: 'contacts',
    summary: 'lookup a contact',
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
        name: 'first_name',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'last_name',
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
        name: 'title',
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
    try {
      const contacts = await prospectService.getContact(req.query);
      res.success({ ...contacts });
    } catch (err) {
      res.status(400).json({ success: false });
    }
  }
);
