import {
  generateJSONBase,
  generateResponseSchema,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const POST = operationMiddleware(
  'resetPassword',
  {
    'x-authz': {
      requiredScope: 'password-reset',
    },
    operationId: 'resetPassword',
    summary: 'Reset Password',
    tags: ['auth'],
    security: [{ Bearer: [] }],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        additionalProperties: false,
        required: [],
        properties: {
          password: {
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
    },
  },

  async (req, res) => {
    const {
      body: { password },
    } = req;

    const user = await req.services.data.user.getSelf();
    // this prevents bad actors from scanning for available accounts
    if (!user) {
      return res.success({});
    }

    if (user.status === 'invited') {
      await req.services.data.user.updateSelf({
        status: 'active',
      });
    }

    await req.services.data.userCredential.upsert({
      password,
      generateTFASecret:
        user.status === 'invited' && process.env.TFA_ENABLED === 'true',
    });

    await req.services.data.user.resetPasswordEmail({
      tenant_id: req.user.tenant,
      email: user.email,
    });

    return res.success({});
  }
);
