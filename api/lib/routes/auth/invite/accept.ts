import {
  generateJSONBase,
  generateResponseSchema,
  responses,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const POST = operationMiddleware(
  'acceptInvite',
  {
    'x-authz': {
      requiredScope: 'invited',
    },
    operationId: 'acceptInvite',
    summary: 'Accept an Invite',
    tags: ['auth'],
    security: [{ Bearer: [] }],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        additionalProperties: false,
        required: ['password', 'first_name', 'last_name'],
        properties: {
          password: {
            type: 'string',
          },
          first_name: {
            type: 'string',
          },
          last_name: {
            type: 'string',
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema({
        type: 'object',
        properties: {},
      }),
      409: responses.badRequest.generate('User is already registered'),
    },
  },

  async (req, res) => {
    const {
      body: { password, first_name, last_name },
    } = req;

    const user = await req.services.data.user.getSelf();
    if (!user || user.status !== 'invited') {
      return res.error(409, { error: 'User is already registered' });
    }

    await Promise.all([
      req.services.data.userCredential.upsert({
        password,
        generateTFASecret: process.env.TFA_ENABLED === 'true',
      }),
      req.services.data.user.updateSelf({
        first_name,
        last_name,
        status: 'active',
      }),
    ]);

    return res.success({});
  }
);
