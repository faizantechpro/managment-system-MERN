import {
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
  parameters,
} from 'lib/middlewares/openapi';
import { ContactFollowerService } from 'lib/services';

export const GET = operationMiddleware(
  'contactIsFollower',
  {
    operationId: 'contactIsFollower',
    summary: `Check if a user is follower`,
    tags: ['contacts'],
    security: [{ Bearer: [] }],
    parameters: [parameters.contactId, parameters.userId],
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
      params: { contact_id, user_id },
    } = req;

    const service = new ContactFollowerService(user);
    const isFollower = await service.isFollower(contact_id, user_id);

    return res.json({ isFollower });
  }
);

export const POST = operationMiddleware(
  'startFollowingContact',
  {
    operationId: 'startFollowingContact',
    summary: 'Start following contact',
    tags: ['contacts'],
    security: [{ Bearer: [] }],
    parameters: [parameters.contactId, parameters.userId],
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
      params: { contact_id, user_id },
    } = req;
    const service = new ContactFollowerService(user);
    await service.startFollowing(contact_id, user_id);

    res.json({});
  }
);

export const DELETE = operationMiddleware(
  'stopFollowingContact',
  {
    operationId: 'stopFollowingContact',
    summary: 'Stop following contact',
    tags: ['contacts'],
    security: [{ Bearer: [] }],
    parameters: [parameters.contactId, parameters.userId],
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
      params: { contact_id, user_id },
    } = req;

    const service = new ContactFollowerService(user);
    await service.stopFollowing(contact_id, user_id);

    res.json({});
  }
);
