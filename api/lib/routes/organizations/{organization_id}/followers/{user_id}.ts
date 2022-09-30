import {
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { OrganizationFollowerService } from 'lib/services';

export const GET = operationMiddleware(
  'organizationIsFollower',
  {
    operationId: 'organizationIsFollower',
    summary: 'Check if a user is follower',
    tags: ['organizations'],
    security: [{ Bearer: [] }],
    parameters: [parameters.organizationId, parameters.userId],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['isFollower'],
        properties: {
          isFollower: {
            type: 'boolean',
          },
        },
      }),
    },
  },

  async (req, res) => {
    const {
      user,
      params: { organization_id, user_id },
    } = req;

    const service = new OrganizationFollowerService(user);
    const isFollower = await service.isFollower(organization_id, user_id);

    return res.json({ isFollower });
  }
);

export const POST = operationMiddleware(
  'startFollowingOrganization',
  {
    operationId: 'startFollowingOrganization',
    summary: 'Start following organization',
    tags: ['organizations'],
    security: [{ Bearer: [] }],
    parameters: [parameters.organizationId, parameters.userId],
    requestBody: {
      required: false,
      ...generateJSONBase({
        type: 'object',
        additionalProperties: false,
        properties: {},
      }),
    },
    responses: {
      200: generateResponseSchema({}),
      404: responses.notFound.generate('Organization'),
    },
  },

  async (req, res) => {
    const {
      user,
      params: { organization_id, user_id },
    } = req;

    const organization =
      await req.services.data.organization.getOrganizationById(organization_id);
    if (!organization) {
      return res.error(404, { error: 'Organization not found' });
    }

    const service = new OrganizationFollowerService(user);
    await service.startFollowing(organization_id, user_id);

    await req.emitter.emitAppEvent({
      event: 'FOLLOWER_ADDED',
      payload: {
        organization,
        user,
      },
    });

    return res.success({});
  }
);

export const DELETE = operationMiddleware(
  'stopFollowingOrganization',
  {
    operationId: 'stopFollowingOrganization',
    summary: 'Stop following organization',
    tags: ['organizations'],
    security: [{ Bearer: [] }],
    parameters: [parameters.organizationId, parameters.userId],
    requestBody: {
      required: false,
      ...generateJSONBase({
        type: 'object',
        additionalProperties: false,
        properties: {},
      }),
    },
    responses: {
      200: generateResponseSchema({}),
    },
  },

  async (req, res) => {
    const {
      user,
      params: { organization_id, user_id },
    } = req;

    const service = new OrganizationFollowerService(user);
    await service.stopFollowing(organization_id, user_id);

    res.json({});
  }
);
