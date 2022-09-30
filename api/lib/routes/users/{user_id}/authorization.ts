import {
  apiSchemas,
  generateResponseSchema,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getUserAuthorization',
  {
    operationId: 'getUserAuthorization',
    summary: 'Get User Authorization',
    tags: ['users'],
    security: [{ Bearer: [] }],
    parameters: [parameters.userId],
    responses: {
      200: generateResponseSchema(apiSchemas.UserAuthorizationAttr),
      404: responses.notFound.generate('User'),
    },
  },

  async (req, res) => {
    const {
      params: { user_id },
    } = req;

    try {
      const userAuthorization =
        await req.services.biz.userAuthorization.getOneByUserId(
          undefined,
          user_id === 'self' ? req.user.id : user_id
        );

      await res.success(userAuthorization);
      return;
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'User not found' });
      }
      throw error;
    }
  }
);
