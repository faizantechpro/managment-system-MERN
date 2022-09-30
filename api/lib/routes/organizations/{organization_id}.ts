import {
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
  parameters,
  schemas,
} from 'lib/middlewares/openapi';
import { organizationPrincipalOwnerValidator } from 'lib/middlewares/ownerValidator';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { organizationServiceFactory } from 'lib/services';
import { permissions } from 'lib/utils/permissions';

const contactsPermissions = permissions.contacts;

export const GET = operationMiddleware(
  'getOrganizationById',
  {
    'x-authz': {
      allowedScopes: ['', 'profile', 'guest', 'impersonation'],
    },
    operationId: 'getOrganizationById',
    summary: 'Get Organization',
    tags: ['organizations'],
    security: [{ Bearer: [] }],
    parameters: [parameters.organizationId],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['organization'],
        properties: {
          organization: schemas.organization,
        },
      }),
    },
  },

  async (req, res) => {
    const { organization_id } = req.params;

    const service = organizationServiceFactory(req.user);
    const organization = await service.getOrganizationById(organization_id);

    // TODO fix type
    return res.json(organization as any);
  }
);

export const PUT = operationMiddleware(
  'updateOrganization',
  {
    operationId: 'updateOrganization',
    summary: 'Update Organization',
    tags: ['organizations'],
    security: [{ Bearer: [] }],
    parameters: [parameters.organizationId],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        properties: {
          name: {
            description: 'Organization name',
            type: 'string',
          },
          status: {
            description: 'Status',
            type: 'string',
            nullable: true,
          },
          industry: {
            description: 'Organization industry',
            type: 'string',
            nullable: true,
          },
          address_city: {
            type: 'string',
            nullable: true,
          },
          address_country: {
            type: 'string',
            nullable: true,
          },
          address_postalcode: {
            type: 'string',
            nullable: true,
          },
          address_state: {
            type: 'string',
            nullable: true,
          },
          address_street: {
            type: 'string',
            nullable: true,
          },
          address_suite: {
            type: 'string',
            nullable: true,
          },
          sic_code: { type: 'string', nullable: true },
          naics_code: { type: 'string', nullable: true },
          employees: { type: 'integer', nullable: true },
          annual_revenue_merchant: {
            nullable: true,
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          annual_revenue_treasury: {
            nullable: true,
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          annual_revenue_business_card: {
            nullable: true,
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          total_revenue: {
            nullable: true,
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          is_customer: { type: 'boolean', nullable: true },
          cif: { type: 'string', nullable: true },
          branch: { type: 'string', nullable: true },
          avatar: { type: 'string', nullable: true },
          label_id: { type: 'string', nullable: true },
          ticker_symbol: { type: 'string', nullable: true },
        },
      }),
    },
    responses: {
      200: generateResponseSchema(schemas.organization),
    },
  },
  permissionsValidator(contactsPermissions.edit) as any,
  async (req, res) => {
    const { organization_id } = req.params;

    if (!req.user.auth.isAdmin && !req.user.auth.isOwner) {
      await organizationPrincipalOwnerValidator({
        id: organization_id,
        user: req.user,
      });
    }

    const body = { ...req.body, date_modified: new Date() };

    const service = organizationServiceFactory(req.user);
    await service.updateOrganization(organization_id, body);
    res.json({});
  }
);

export const DELETE = operationMiddleware(
  'deleteOrganization',
  {
    operationId: 'deleteOrganization',
    summary: 'Delete organization',
    tags: ['organizations'],
    security: [{ Bearer: [] }],
    parameters: [parameters.organizationId],
    responses: {
      204: {
        description: 'Organization deleted',
      },
    },
  },

  permissionsValidator(contactsPermissions.delete) as any,
  async (req, res) => {
    const { organization_id } = req.params;

    if (!req.user.admin) {
      await organizationPrincipalOwnerValidator({
        id: organization_id,
        user: req.user,
      });
    }

    await req.services.data.organization.deleteOne(organization_id);

    res.status(204).end();
  }
);
