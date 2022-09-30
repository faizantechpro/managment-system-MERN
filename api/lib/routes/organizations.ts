import {
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
  queries,
  schemas,
} from 'lib/middlewares/openapi';
import { permissionsValidator } from 'lib/middlewares/permissions';
import {
  OrganizationOwnerService,
  organizationServiceFactory,
} from 'lib/services';
import { permissions } from 'lib/utils/permissions';

const contactsPermissions = permissions.contacts;

export const GET = operationMiddleware(
  'getOrganizations',
  {
    'x-authz': {
      allowedScopes: ['', 'profile', 'guest', 'impersonation'],
    },
    operationId: 'getOrganizations',
    summary: 'Get Organizations',
    tags: ['organizations'],
    security: [{ Bearer: [] }],
    parameters: [
      ...queries.pagination,
      queries.search,
      {
        in: 'query',
        name: 'recent_activity',
        required: false,
        schema: {
          type: 'boolean',
        },
      },
      {
        in: 'query',
        name: 'order',
        required: false,
      },
      {
        in: 'query',
        name: 'is_customer',
        required: true,
        schema: {
          type: 'boolean',
          default: false,
        },
      },
      {
        in: 'query',
        name: 'cif',
        required: true,
        schema: {
          type: 'boolean',
          default: false,
        },
      },
    ],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['pagination', 'organizations'],
        properties: {
          pagination: schemas.paginationResponse,
          organizations: {
            type: 'array',
            items: {
              ...schemas.organization,
              properties: {
                ...schemas.organization.properties,
                total_contacts: {
                  type: 'number',
                },
                total_open_deals: {
                  type: 'number',
                },
                total_closed_deals: {
                  type: 'number',
                },
              },
            },
          },
        },
      }),
    },
  },

  permissionsValidator(contactsPermissions.view) as any,
  async (req, res) => {
    const { query, user } = req;

    const { page, limit, search, ...additionalQuery } = query;

    if (query.recent_activity) {
      const organizations =
        await req.services.biz.organizationFeed.getAsRecentlyViewed(
          undefined,
          {
            page,
            limit,
          },
          { search }
        );

      return res.success({
        organizations: organizations.data,
        pagination: organizations.pagination,
      });
    }

    const service = organizationServiceFactory(user);
    const dataOrganizations = await service.getOrganizations(
      { page, limit, search },
      additionalQuery as any
    );

    const { organizations, pagination } = dataOrganizations;

    const organizationService = new OrganizationOwnerService(req.user);
    const listOrganizations = await Promise.all(
      organizations?.map(async (organization: any) => {
        const owners = await organizationService.getOwners(organization.id, {
          limit: 20,
          page: 1,
        });
        return { ...organization, owners: owners?.data };
      })
    );

    return res.success({
      pagination,
      organizations: listOrganizations,
    });
  }
);

export const POST = operationMiddleware(
  'createOrganization',
  {
    operationId: 'createOrganization',
    summary: 'Create Organization',
    tags: ['organizations'],
    security: [{ Bearer: [] }],
    parameters: [],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        additionalProperties: true,
        properties: {
          assigned_user_id: {
            type: 'string',
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema(schemas.organization),
    },
  },

  permissionsValidator(contactsPermissions.create) as any,
  async (req, res) => {
    const {
      body: { assigned_user_id, external_id, ...rest },
      user: { id: userId },
    } = req;

    const data = {
      ...(rest as any), // TODO input contract should be well defined
      date_entered: new Date(), // TODO perhaps default on db model?
      date_modified: new Date(), // TODO perhaps default on service?
      created_by: userId,
      modified_user_id: userId,
      assigned_user_id: assigned_user_id || userId,
      external_id: external_id || null,
    };

    const service = organizationServiceFactory(req.user);

    if (external_id) {
      const organization = await service.getOrganizationByExternalId(
        external_id as string
      );

      if (organization) {
        return res.json(organization);
      }
    }

    const organization = await service.createOrganization(data);

    return res.json(organization);
  }
);

export const DELETE = operationMiddleware(
  'deleteOrganizations',
  {
    operationId: 'deleteOrganizations',
    summary: 'Delete Organizations',
    tags: ['organizations'],
    security: [{ Bearer: [] }],
    parameters: [
      {
        in: 'query',
        name: 'ids',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: generateResponseSchema({}),
    },
  },

  permissionsValidator(contactsPermissions.delete) as any,
  async (req, res) => {
    const { ids } = req.query;
    const service = organizationServiceFactory(req.user);
    const organizationsToDelete = ids.split(',');

    const deleteOrganization = async (id: string) => {
      try {
        await service.deleteOne(id);
        return { id: id, result: 'success', msg: '' };
      } catch (error: any) {
        return {
          id: id,
          result: 'failed',
          msg: error.message,
        };
      }
    };

    const organizationsDeletionResult = await Promise.all(
      organizationsToDelete.map(async (id: any) => {
        return deleteOrganization(id);
      })
    );

    return res.success(organizationsDeletionResult);
  }
);
