// TODO look into refactoring ino a generic orgs/deals/contacts generic

import {
  generateErrorResponseSchema,
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
} from 'lib/middlewares/openapi';

export const POST = operationMiddleware(
  'createActivity',
  {
    'x-authz': {
      allowedScopes: ['', 'profile', 'guest', 'impersonation'],
    },
    operationId: 'createActivity',
    summary: 'Create an Activity',
    tags: ['activities'],
    security: [{ Bearer: [] }],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        // owner not required if guest
        required: ['name', 'type', 'start_date'],
        properties: {
          organization_id: {
            type: 'string',
            nullable: true,
          },
          deal_id: {
            type: 'string',
            nullable: true,
          },
          name: {
            type: 'string',
          },
          type: {
            type: 'string',
          },
          start_date: {
            type: 'string',
          },
          guests: {
            type: 'string',
          },
          location: {
            type: 'string',
          },
          conference_link: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          free_busy: {
            type: 'string',
          },
          notes: {
            type: 'string',
          },
          rich_note: {
            type: 'object',
            nullable: true,
          },
          owner: {
            type: 'string',
          },
          lead: {
            type: 'string',
          },
          done: {
            type: 'boolean',
          },
          contact_info: {
            type: 'object',
            nullable: true,
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema({
        type: 'object',
        properties: {},
      }),
      400: generateErrorResponseSchema({
        description: 'Bad Request',
        errors: [
          {
            title: 'Owner required',
          },
        ],
      }),
    },
  },

  async (req, res) => {
    const { body, user } = req;

    if (user.jwt.scope !== 'guest') {
      if (!body.owner) {
        return res.error(400, { error: 'Owner required' });
      }
    } else {
      if (
        (body.owner && user.jwt.shared_by_id !== body.owner) ||
        (body.organization_id &&
          user.jwt.resource_access.organization[0].id !==
            body.organization_id) ||
        body.deal_id
      ) {
        throw new req.exception.Forbidden();
      }

      // sorry for this hacky workaround...
      (body as any).userId = user.jwt.shared_by_id;
      if (!body.owner) {
        body.owner = user.jwt.shared_by_id;
      }
      if (!body.organization_id) {
        body.organization_id = user.jwt.resource_access.organization[0].id;
      }
    }

    const result = await req.services.data.activity.addActivity(body);

    return res.success(result as any);
  }
);
