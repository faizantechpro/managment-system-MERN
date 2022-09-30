import {
  generateResponseSchema,
  operationMiddleware,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { TenantService } from 'lib/services';

export const GET = operationMiddleware(
  'getTenantBySubdomain',
  {
    operationId: 'getTenantBySubdomain',
    summary: `Get tenant by domain`,
    tags: ['tenants'],
    parameters: [parameters.domain],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: [],
        properties: {
          tenant: {},
        },
      }),
      404: responses.notFound.generate('Tenant'),
    },
  },

  async (req, res) => {
    const tenant = await TenantService.getTenantBySubdomain(
      req?.params?.domain
    );

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    return res.success({ tenant });
  }
);
