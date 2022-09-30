import {
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
  responses,
} from 'lib/middlewares/openapi';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { TenantService } from 'lib/services';

export const GET = operationMiddleware(
  'getTenantById',
  {
    operationId: 'getTenantById',
    summary: 'Get Tenant by Id',
    tags: ['tenants'],
    security: [{ Bearer: [] }],
    parameters: [],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: [],
        properties: {
          tenant: {
            type: 'object',
            required: [],
          },
        },
      }),
      404: responses.notFound.generate('Tenant'),
    },
  },

  async (req, res) => {
    const tenant_id = req?.user?.tenant || '';

    const tenant = await TenantService.getTenantById(tenant_id);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    return res.json({ tenant });
  }
);

export const PUT = operationMiddleware(
  'updateTenant',
  {
    operationId: 'updateTenant',
    summary: 'Update Tenant',
    tags: ['tenants'],
    security: [{ Bearer: [] }],
    parameters: [],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        additionalProperties: true,
        properties: {
          tenant: {
            type: 'object',
            required: ['name', 'colors'],
            properties: {
              name: {
                type: 'string',
              },
              domain: {
                type: 'string',
              },
              logo: {
                type: 'string',
              },
              icon: {
                type: 'string',
              },
              use_logo: {
                type: 'boolean',
              },
              colors: {
                type: 'object',
                additionalProperties: true,
                required: ['name', 'primaryColor', 'secondaryColor'],
                properties: {
                  primaryColor: {
                    type: 'string',
                  },
                  secondaryColor: {
                    type: 'string',
                  },
                  name: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema({
        type: 'object',
      }),
      404: responses.notFound.generate('Tenant'),
    },
  },

  permissionsValidator() as any,
  async (req, res) => {
    const tenant_id = req?.user?.tenant || '';

    const tenant = await TenantService.updateTenant(tenant_id, req.body.tenant);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    return res.json({});
  }
);

export const POST = operationMiddleware(
  'createTenant',
  {
    operationId: 'createTenant',
    summary: 'Create Tenant',
    tags: ['tenants'],
    security: [{ Bearer: [] }],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        additionalProperties: true,
        required: [
          'name',
          'type',
          'domain',
          'modules',
          'colors',
          'logo',
          'icon',
          'use_logo',
        ],
        properties: {
          name: {
            type: 'string',
          },
          logo: {
            type: 'string',
          },
          icon: {
            type: 'string',
          },
          use_logo: {
            type: 'boolean',
          },
          domain: {
            type: 'string',
          },
          type: {
            type: 'string',
          },
          modules: {
            type: 'string',
          },
          colors: {
            type: 'object',
            additionalProperties: true,
            required: ['name', 'primaryColor', 'secondaryColor'],
            properties: {
              primaryColor: {
                type: 'string',
              },
              secondaryColor: {
                type: 'string',
              },
              name: {
                type: 'string',
              },
            },
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['tenant'],
      }),
    },
  },

  permissionsValidator() as any,
  async (req, res) => {
    const tenant = await TenantService.createTenant({
      ...req.body,
    });

    res.json({ tenant });
  }
);
