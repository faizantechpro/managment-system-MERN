import {
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
  responses,
} from 'lib/middlewares/openapi';
import { userServiceFactory } from 'lib/services';
import { userCredentialFactory } from 'lib/services/user';

export const PUT = operationMiddleware(
  'changePassword',

  {
    operationId: 'changePassword',
    summary: 'Change password',
    tags: ['users'],
    security: [{ Bearer: [] }],
    parameters: [
      {
        in: 'path',
        name: 'user_id',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        additionalProperties: false,
        required: [],
        properties: {
          generate: {
            type: 'boolean',
          },
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
      400: responses.badRequest.generate('Password or generate required'),
      404: responses.notFound.generate('User'),
    },
  },

  async (req, res) => {
    const {
      body: { generate, password },
      params: { user_id },
    } = req;

    const userService = userServiceFactory(req.user);
    const userCredentialService = userCredentialFactory({ id: user_id } as any);

    let newPassword = password;
    if (generate) {
      newPassword = userCredentialService.generatePassword();
    }
    if (!newPassword) {
      return res.error(400, { error: 'Password or generate required' });
    }

    const user = await userService.getUser(user_id);
    if (!user) {
      return res.error(404, { error: 'User not found' });
    }

    await userCredentialService.upsert({ password: newPassword });
    await userService.passwordReset({
      email: user.email,
      password: newPassword,
      tenant_id: user.tenant_id,
    });

    return res.success({});
  }
);
