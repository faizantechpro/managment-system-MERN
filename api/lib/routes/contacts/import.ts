import { ContactModifyAttributes } from 'lib/database/models/contacts';
import { generateResponseSchema, responses } from 'lib/middlewares/openapi';
import { ImportContactAttributes } from 'lib/services';
import { operationMiddleware } from 'lib/utils';
import csv from 'lib/utils/csv';
import multer from 'multer';
import { Readable } from 'stream';

export const POST = operationMiddleware(
  'contactImport',
  {
    operationId: 'contactImport',
    summary: 'Import Contacts',
    tags: ['contacts', 'import'],
    security: [{ Bearer: [] }],
    parameters: [
      // lol.... this is pre-openapi. move it into body (for file upload)
      {
        in: 'query',
        name: 'updateExisting',
        required: false,
        schema: {
          type: 'string',
        },
      },
    ],
    requestBody: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            required: [],
            properties: {
              file: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
        'application/json': {
          schema: {
            type: 'object',
            required: ['contacts'],
            properties: {
              update_existing: {
                type: 'boolean',
              },
              contacts: {
                type: 'array',
                maxItems: 1000,
                items: {
                  type: 'object',
                  required: ['first_name', 'last_name', 'email_work'],
                  properties: {
                    first_name: {
                      type: 'string',
                    },
                    last_name: {
                      type: 'string',
                    },
                    email_work: {
                      type: 'string',
                    },
                    title: {
                      type: 'string',
                    },
                    email_other: {
                      type: 'string',
                    },
                    phone_work: {
                      type: 'string',
                    },
                    phone_mobile: {
                      type: 'string',
                    },
                    phone_home: {
                      type: 'string',
                    },
                    phone_other: {
                      type: 'string',
                    },
                    external_id: {
                      type: 'string',
                    },
                    organization: {
                      type: 'object',
                      additionalProperties: true,
                      required: ['name'],
                      properties: {
                        name: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['contacts'],
        properties: {
          totalItems: {
            type: 'number',
          },
          itemsFailed: {
            type: 'array',
            items: {
              type: 'object',
            },
          },
          contacts: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id'],
              properties: {
                id: {
                  type: 'string',
                },
              },
            },
          },
        },
      }),
      400: responses.badRequest.generate(
        'File not provided',
        'Invalid mime type'
      ),
    },
  },

  multer().single('file') as any,
  async (req, res) => {
    const { file } = req;

    const importLimit = 1000;
    let failedItems: (Partial<ContactModifyAttributes> & {
      organization?: string;
    })[] = [];

    let contacts: ImportContactAttributes[] = [];
    let updateExisting = req.query.updateExisting === 'true';

    // this means it's JSON
    if ('contacts' in req.body) {
      contacts = req.body.contacts as ImportContactAttributes[];
      updateExisting = req.body.update_existing || updateExisting;
    }
    // this is for multipart files
    else {
      if (!file) {
        return res.error(400, { error: 'File not provided' });
      }
      if (file.mimetype !== 'text/csv') {
        return res.error(400, { error: 'Invalid mime type' });
      }
      const csvContacts = await csv.parser<
        Pick<
          Partial<ContactModifyAttributes>,
          | 'first_name'
          | 'last_name'
          | 'email_work'
          | 'title'
          | 'email_other'
          | 'phone_work'
          | 'phone_mobile'
          | 'phone_home'
          | 'phone_other'
        > & { organization: string }
      >(Readable.from(file.buffer.toString('utf-8')), {
        delimiter: ',',
        columns: true,
      });
      // csv allows >limit, need to splice and then find issues within range
      const csvContactsSpliced = csvContacts.splice(0, importLimit);

      failedItems = csvContactsSpliced.filter((contact) => {
        return !contact.first_name || !contact.last_name || !contact.email_work;
      });
      contacts = csvContactsSpliced
        .filter((contact) => {
          return contact.first_name && contact.last_name && contact.email_work;
        })
        .map((contact) => {
          return {
            first_name: contact.first_name,
            last_name: contact.last_name,
            email_work: contact.email_work,
            title: contact.title,
            email_other: contact.email_other,
            phone_work: contact.phone_work,
            phone_mobile: contact.phone_mobile,
            phone_home: contact.phone_home,
            phone_other: contact.phone_other,
            organization: {
              name: contact.organization,
            },
          };
        }) as ImportContactAttributes[];

      // in case csv is attempting to import beyond limit
      if (csvContacts.length > importLimit) {
        failedItems = failedItems.concat(...csvContacts.slice(importLimit));
      }
    }

    const { itemsFailed, contacts: upsertedContacts } =
      await req.services.data.contact.import(contacts, {
        updateExisting,
      });

    return res.success({
      itemsFailed: failedItems.concat(...(itemsFailed as any)),
      totalItems: contacts.length,
      contacts: upsertedContacts,
    });
  }
);
