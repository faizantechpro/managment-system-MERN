import {
  generateResponseSchema,
  operationMiddleware,
  parameters,
} from 'lib/middlewares/openapi';
import { FilesService, userServiceFactory } from 'lib/services';
import { storage } from 'lib/storage';

export const GET = operationMiddleware(
  'getUserAvatar',
  {
    operationId: 'getUserAvatar',
    summary: 'Get User Avatar URL',
    description: `Get a user's signed avatar URL.`,
    tags: ['users'],
    security: [{ Bearer: [] }],
    parameters: [parameters.userId],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'Signed image URL',
          },
          expiry: {
            type: 'string',
            description: 'ISO date of when avatar link expires',
          },
        },
      }),
    },
  },

  async (req, res) => {
    const {
      params: { user_id },
    } = req;

    const userService = userServiceFactory(req.user);
    const user = await userService.getUser(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.avatar) {
      return res.json({});
    }

    const fileService = new FilesService();
    const file = await fileService.readOne(user.avatar); // throws if not found

    // might happen on some rare race condition?
    if (!file.filename_disk) {
      return res.status(422).json({ error: 'Unable to fetch user avatar' });
    }

    const disk = storage.disk(file.storage);

    const { exists } = await disk.exists(file.filename_disk);
    if (!exists) {
      return res.status(404).json({ error: 'Avatar not found' });
    }

    const now = new Date();
    const { signedUrl } = await disk.getSignedUrl(file.filename_disk);

    return res.json({
      url: signedUrl,
      // 900 is the default signed url duration
      expiry: new Date(now.valueOf() + 900 * 1000).toISOString(),
    });
  }
);
