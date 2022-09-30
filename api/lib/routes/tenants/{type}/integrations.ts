import {
  generateErrorResponseSchema,
  generateJSONBase,
  generateResponseSchema,
  parameters,
  responses,
  schemas,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getIntegration',
  {
    operationId: 'getIntegration',
    summary: 'Get Integration',
    tags: ['tenants', 'integrations'],
    security: [{ Bearer: [] }],
    parameters: [
      parameters.integrationType,
      {
        in: 'query',
        name: 'tenant_id',
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: generateResponseSchema(schemas.tenantIntegration),
      404: responses.notFound.generate('Integration'),
    },
  },

  async (req, res) => {
    const {
      params: { type },
      query: { tenant_id },
    } = req;

    const integration = await req.services.biz.tenantIntegration.findOneByType(
      { tenantId: tenant_id },
      type
    );
    if (!integration) {
      return res.error(404, { error: 'Integration not found' });
    }

    return res.success(integration);
  }
);

export const POST = operationMiddleware(
  'createIntegration',
  {
    operationId: 'createIntegration',
    summary: 'Create an Integration',
    tags: ['tenants', 'integrations'],
    security: [{ Bearer: [] }],
    parameters: [parameters.integrationType],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        required: ['credentials', 'enabled'],
        properties: {
          // admins are allowed to create integrations on behalf of others
          tenant_id: {
            type: 'string',
          },
          credentials: {
            type: 'object',
            oneOf: [
              {
                type: 'object',
                required: ['client_id', 'client_secret'],
                properties: {
                  url: {
                    type: 'string',
                    default: 'https://prod.api.fiservapps.com',
                  },
                  client_id: {
                    type: 'string',
                  },
                  client_secret: {
                    type: 'string',
                  },
                },
              },
            ],
          },
          enabled: {
            type: 'boolean',
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema(schemas.tenantIntegration),
      403: generateErrorResponseSchema({
        description: 'Unauthorized',
        errors: [
          {
            title: 'Unauthorized',
          },
        ],
      }),
      409: generateErrorResponseSchema({
        description: 'Conflict',
        errors: [
          {
            title: 'Integration already exists',
          },
        ],
      }),
    },
  },

  async (req, res) => {
    const {
      body,
      params: { type },
    } = req;

    try {
      const integration = await req.services.biz.tenantIntegration.create(
        { tenantId: body.tenant_id },
        type,
        body
      );
      return res.success(integration);
    } catch (error) {
      if (error instanceof req.exception.Forbidden) {
        return res.error(error.status, { error: 'Unauthorized' });
      }
      if (error instanceof req.exception.Conflict) {
        return res.error(error.status, { error: 'Integration already exists' });
      }

      throw error;
    }
  }
);

export const PUT = operationMiddleware(
  'updateIntegration',
  {
    operationId: 'updateIntegration',
    summary: 'Update a Tenant Integration',
    tags: ['tenants', 'integrations'],
    security: [{ Bearer: [] }],
    parameters: [parameters.integrationType],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        properties: {
          tenant_id: {
            type: 'string',
          },
          credentials: {
            type: 'object',
            oneOf: [
              {
                type: 'object',
                required: ['url', 'client_id', 'client_secret'],
                properties: {
                  url: {
                    type: 'string',
                    default: 'https://prod.api.fiservapps.com',
                  },
                  client_id: {
                    type: 'string',
                  },
                  client_secret: {
                    type: 'string',
                  },
                },
              },
            ],
          },
          enabled: {
            type: 'boolean',
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema(schemas.tenantIntegration),
      403: generateErrorResponseSchema({
        description: 'Unauthorized',
        errors: [
          {
            title: 'Unauthorized',
          },
        ],
      }),
      404: responses.notFound.generate('Integration'),
    },
  },

  async (req, res) => {
    const {
      body,
      params: { type },
      user,
    } = req;

    if (!user.auth.isAdmin && !user.auth.isOwner) {
      return res.error(403, { error: 'Unauthorized' });
    }

    const integration = await req.services.biz.tenantIntegration.findOneByType(
      { tenantId: body.tenant_id },
      type
    );
    if (!integration) {
      return res.error(404, { error: 'Integration not found' });
    }

    const updatedIntegration =
      await req.services.biz.tenantIntegration.updateByType(
        { tenantId: body.tenant_id },
        type,
        body
      );

    await res.success(updatedIntegration!);
    return;
  }
);

export const DELETE = operationMiddleware(
  'deleteIntegration',
  {
    operationId: 'deleteIntegration',
    summary: 'Delete a Tenant Integration',
    tags: ['tenants', 'integrations'],
    security: [{ Bearer: [] }],
    parameters: [parameters.integrationType],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        required: [],
        properties: {
          tenant_id: {
            type: 'string',
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema({}),
      403: generateErrorResponseSchema({
        description: 'Unauthorized',
        errors: [
          {
            title: 'Unauthorized',
          },
        ],
      }),
      404: responses.notFound.generate('Integration'),
    },
  },

  async (req, res) => {
    const {
      body: { tenant_id },
      params: { type },
      user,
    } = req;

    if (!user.auth.isAdmin && !user.auth.isOwner) {
      return res.error(403, { error: 'Unauthorized' });
    }

    const integration = await req.services.biz.tenantIntegration.findOneByType(
      { tenantId: tenant_id },
      type
    );
    if (!integration) {
      return res.error(404, { error: 'Integration not found' });
    }

    await req.services.biz.tenantIntegration.deleteByType(
      { tenantId: tenant_id },
      type
    );

    return res.success({});
  }
);
