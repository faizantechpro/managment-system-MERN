import {
  generateErrorResponseSchema,
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
  responses,
} from 'lib/middlewares/openapi';
import { MailService } from 'lib/services/mail';
import { TenantService } from 'lib/services';

export const POST = operationMiddleware(
  'createGuestToken',
  {
    operationId: 'createGuestToken',
    summary: 'Create a Guest JWT',
    description:
      'Create a guest JWT based on the grant type. Guest should have been previously invited by another owner.',
    tags: ['auth'],
    parameters: [],
    requestBody: {
      required: true,
      ...generateJSONBase({
        oneOf: [
          {
            type: 'object',
            additionalProperties: false,
            required: ['grant_type', 'token', 'redirect_url'],
            properties: {
              grant_type: {
                type: 'string',
                enum: ['guest_refresh'],
              },
              token: {
                type: 'string',
              },
              redirect_url: {
                description: 'The URL the guest user should be navigated to',
                type: 'string',
              },
            },
          },
          {
            type: 'object',
            additionalProperties: false,
            required: ['grant_type', 'redirect_url', 'email'],
            properties: {
              grant_type: {
                type: 'string',
                enum: ['guest_generate'],
              },
              redirect_url: {
                description: 'The URL the guest user should be navigated to',
                type: 'string',
              },
              email: {
                type: 'object',
                required: ['to'],
                properties: {
                  to: {
                    type: 'string',
                  },
                  subject: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        ],
      }),
    },
    responses: {
      200: generateResponseSchema({}),
      400: generateErrorResponseSchema({
        description: 'Invalid input provided',
        errors: [
          {
            title: 'Invalid guest information',
          },
          {
            title: 'Invalid token provided',
          },
        ],
      }),
      404: responses.notFound.generate('Guest'),
    },
  },

  async (req, res) => {
    const {
      body,
      body: { redirect_url },
    } = req;

    let email: string | undefined;
    let token: string | undefined;
    let organizationId: string | undefined;

    // feels iffy, need a better way to include email contents
    let subject = '';
    let message = '';
    let tenant = '';

    if (body.grant_type === 'guest_refresh') {
      const refreshedGuest = req.services.data.organizationGuest.refreshToken(
        body.token
      );

      email = refreshedGuest.payload.email;
      token = refreshedGuest.token;
      organizationId =
        refreshedGuest.payload.resource_access.organization[0].id;
      tenant = refreshedGuest.payload.tenant_id;
    } else if (body.grant_type === 'guest_generate') {
      const guest = await req.services.data.organizationGuest.getByEmail(
        body.email.to
      );
      if (!guest) {
        return res.error(404, { error: 'Guest not found' });
      }

      email = guest.email;
      token = req.services.data.organizationGuest.generateToken(guest);
      organizationId = guest.organization_id;

      subject = body.email.subject ? body.email.subject : subject;
      message = body.email.message ? body.email.message : message;
      tenant = guest.tenant_id;
    }

    if (!token || !organizationId || !email) {
      return res.error(400, { error: 'Invalid guest information' });
    }
    const tplData = await TenantService.getMailThemeData(tenant);
    const mailService = new MailService();
    await mailService.send({
      tenant_id: tenant,
      to: email,
      subject,
      template: {
        name: 'public-report-email',
        data: {
          ...tplData,
          link: `${redirect_url}?token=${token}&resource_id=${organizationId}`,
          message,
        },
      },
    });

    return res.success({});
  }
);
