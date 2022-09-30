import { AuthUser } from 'lib/middlewares/auth';
import {
  generateResponseSchema,
  operationMiddleware,
  parameters,
} from 'lib/middlewares/openapi';
import { FilesService, TenantService, userServiceFactory } from 'lib/services';
import { storage } from 'lib/storage';
import { APIRequest } from 'lib/utils';

export const GET = operationMiddleware(
  'getAvatar',
  {
    'x-authz': {
      optional: true,
    },
    operationId: 'getAvatar',
    summary: 'Get Avatar URL',
    tags: ['avatars'],
    security: [{ Bearer: [] }],
    parameters: [parameters.avatarId],
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
      params: { avatar_id },
      user,
    } = req;

    // only tenant logo is public for now
    if (!user) {
      const tenant = await TenantService.getByLogo(avatar_id);
      if (!tenant) {
        throw new req.exception.Forbidden();
      }
    }

    if (user && user.jwt.scope === 'guest') {
      const isValid = await validateGuestAvatar(req, user);
      if (!isValid) {
        throw new req.exception.Forbidden();
      }
    }

    const fileService = new FilesService();
    const file = await fileService.readOne(avatar_id); // throws if not found

    // might happen on some rare race condition?
    if (!file.filename_disk) {
      return res.status(422).json({ error: 'Unable to fetch avatar' });
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

async function validateGuestAvatar(
  req: APIRequest<'getAvatar'>,
  user: AuthUser
) {
  const {
    params: { avatar_id },
  } = req;

  if (user.jwt.scope !== 'guest') {
    return false;
  }

  const userService = userServiceFactory(user);
  const sharedByUser = await userService.getUser(user.jwt.shared_by_id);
  if (!sharedByUser) {
    return false;
  }
  if (sharedByUser.avatar === avatar_id) {
    return true;
  }

  const { id: organization_id } = user.jwt.resource_access.organization[0];

  const organization = await req.services.data.organization.getByAvatarId(
    avatar_id
  );
  if (organization) {
    if (organization.id === organization_id) {
      return true;
    } else {
      return false;
    }
  }

  const contact = await req.services.data.contact.getByAvatarId(avatar_id);
  return !!contact && contact.organization_id === organization_id;
}
