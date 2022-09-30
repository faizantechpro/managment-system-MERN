import {
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
} from 'lib/middlewares/openapi';
import { NotificationService } from 'lib/services';

export const GET = operationMiddleware(
  'getNotificationSettings',
  {
    operationId: 'getNotificationSettings',
    summary: 'Get Notification Settings',
    tags: ['notifications'],
    security: [{ Bearer: [] }],
    parameters: [],
    responses: {
      200: generateResponseSchema({
        type: 'object',
      }),
    },
  },

  async (req, res) => {
    const settings = await NotificationService.getSettingsByUserId(req.user.id);

    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    return res.json(settings);
  }
);

export const POST = operationMiddleware(
  'addNotificationSettings',
  {
    operationId: 'addNotificationSettings',
    summary: 'Add Notification Settings',
    tags: ['notifications'],
    security: [{ Bearer: [] }],
    parameters: [],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        required: ['settings'],
        additionalProperties: true,
        properties: {
          settings: {
            type: 'object',
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema({
        type: 'object',
      }),
    },
  },

  async (req, res) => {
    const settings = await NotificationService.addSettings(
      req.user,
      req?.body?.settings
    );

    return res.json(settings);
  }
);
