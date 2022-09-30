import {
  generateResponseSchema,
  operationMiddleware,
} from 'lib/middlewares/openapi';
import { prospectFactory } from 'lib/services/prospects';

export const GET = operationMiddleware(
  'companies',
  {
    operationId: 'companies',
    summary: 'lookup companies',
    tags: ['prospects'],
    security: [{ Bearer: [] }],
    parameters: [
      {
        in: 'query',
        name: 'name',
        schema: {
          type: 'string',
        },
        required: true,
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
      const contacts = await prospectService.getCompany({
        name: req.query.name,
      });
      res.success({ ...contacts });
    } catch (err) {
      console.log(err);
      res.status(400).json({ success: false });
    }
  }
);
