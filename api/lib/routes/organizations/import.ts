import {
  generateResponseSchema,
  operationMiddleware,
  responses,
} from 'lib/middlewares/openapi';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { permissions } from 'lib/utils/permissions';
import { organizationServiceFactory } from 'lib/services';
import multer from 'multer';

const contactsPermissions = permissions.contacts;
export const POST = operationMiddleware(
  'import',
  {
    operationId: 'import',
    summary: 'Import Organizations',
    tags: ['organizations', 'import'],
    security: [{ Bearer: [] }],
    requestBody: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {},
          },
        },
        'application/json': {
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
    responses: {
      200: generateResponseSchema({
        type: 'object',
      }),
      400: responses.badRequest.generate(
        'File not provided',
        'Invalid mime type'
      ),
    },
  },
  permissionsValidator(contactsPermissions.create) as any,
  multer().single('file') as any,
  async (req, res) => {
    const { file } = req;

    if (!file) {
      return res.error(400, { error: 'File not provided' });
    }
    if (file.mimetype !== 'text/csv') {
      return res.error(400, { error: 'Invalid mime type' });
    }

    const organizationService = organizationServiceFactory(req.user);
    const { updateExisting } = req.query;

    const result = await organizationService.import(file, updateExisting);

    return res.success(result);
  }
);
