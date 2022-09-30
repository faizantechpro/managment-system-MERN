import xlsx from 'node-xlsx';
import multer from 'multer';
import {
  generateErrorResponseSchema,
  generateResponseSchema,
  responses,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

// TODO add authorization per Auth object "x-authz"
export const POST = operationMiddleware(
  'naicsUpload',
  {
    operationId: 'naicsUpload',
    summary: 'NAICS Upload',
    tags: ['naics'],
    security: [{ Bearer: [] }],
    requestBody: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['s&p'],
              },
              report_date: {
                type: 'string',
                // YYYY-MM-DD pattern
                pattern: 'd{4}-d{2}-d{2}',
              },
            },
          },
        },
      },
    },
    responses: {
      200: generateResponseSchema({
        type: 'object',
        properties: {},
      }),
      400: responses.badRequest.generate(
        'File not provided',
        'Type not provided',
        'Report date not provided'
      ),
      403: generateErrorResponseSchema({
        description: 'Unauthorized',
        errors: [
          {
            title: 'Unauthorized to upload',
          },
        ],
      }),
    },
  },

  multer().single('file') as any,
  async (req, res) => {
    const {
      file,
      body: { type, report_date },
      user,
    } = req;

    if (!file) {
      return res.error(400, { error: 'File not provided' });
    }
    // form-data doesn't work well with openapi validator so must manually check
    if (!type) {
      return res.error(400, { error: 'Type not provided' });
    }
    if (!report_date) {
      return res.error(400, { error: 'Report date not provided' });
    }
    if (!user.auth.isAdmin) {
      return res.error(403, { error: 'Unauthorized to upload' });
    }

    const obj = xlsx.parse(file.buffer);
    await req.services.biz.insight.uploadXls(
      { type, excel: obj as any },
      report_date
    );

    return res.success({});
  }
);
