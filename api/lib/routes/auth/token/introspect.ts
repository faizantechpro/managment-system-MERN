import {
  generateErrorResponseSchema,
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
  schemas,
} from 'lib/middlewares/openapi';
import { JWT, userServiceFactory } from 'lib/services';

export const POST = operationMiddleware(
  'tokenIntrospection',
  {
    operationId: 'tokenIntrospection',
    summary: 'Token Introspection',
    description: 'Introspects a given token to check its contents and validity',
    tags: ['auth'],
    parameters: [],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        required: ['token'],
        properties: {
          token: {
            type: 'string',
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema({
        type: 'object',
        oneOf: [
          {
            type: 'object',
            required: [
              'scope',
              'email',
              'contact_id',
              'shared_by',
              'resource_access',
            ],
            properties: {
              scope: {
                type: 'string',
                enum: ['guest'],
              },
              email: {
                type: 'string',
              },
              contact_id: {
                type: 'string',
              },
              shared_by: schemas.user,
              resource_access: {
                type: 'object',
                required: ['organization'],
                properties: {
                  organization: schemas.resourceAccess,
                },
              },
            },
          },
        ],
      }),
      400: generateErrorResponseSchema({
        description: 'Invalid token provided',
        errors: [
          {
            title: 'Invalid token information',
          },
        ],
      }),
    },
  },

  async (req, res) => {
    const { body } = req;

    try {
      const jwt = new JWT(body.token);
      jwt.verify();

      // for now, only do guest introspects
      if (!jwt.payload || jwt.payload.scope !== 'guest') {
        return res.error(400, { error: 'Invalid token information' });
      }

      req.services.data.user = userServiceFactory({
        id: jwt.payload.shared_by_id,
        tenant: jwt.payload.tenant_id,
        auth: { isAdmin: false, isOwner: false },
      } as any);
      const sharedBy = await req.services.data.user.getUser(
        jwt.payload.shared_by_id,
        jwt.payload.tenant_id
      );
      if (!sharedBy) {
        return res.error(400, { error: 'Invalid token information' });
      }
      return res.success({
        scope: jwt.payload.scope,
        email: jwt.payload.email,
        resource_access: jwt.payload.resource_access,
        shared_by: sharedBy,
        contact_id: jwt.payload.contact_id,
      });
    } catch (error) {
      return res.error(400, { error: 'Invalid token information' });
    }
  }
);
