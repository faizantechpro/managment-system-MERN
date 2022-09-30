import {
  generateErrorResponseSchema,
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { MailService } from 'lib/services/mail';
import { OrganizationGuestService } from 'lib/services';
import { TenantService } from 'lib/services';

export const POST = operationMiddleware(
  'createContactGuest',
  {
    operationId: 'createContactGuest',
    summary: 'Create a Contact Guest',
    description: 'Creates a guest contact and emails a valid JWT',
    tags: ['contacts'],
    security: [{ Bearer: [] }],
    parameters: [parameters.contactId],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        additionalProperties: false,
        required: ['redirect_url', 'email'],
        properties: {
          redirect_url: {
            description:
              'The URL the guest user should be navigated to. token and resource_id will be added as query parameters.',
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
          resources: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
              },
              id: {
                type: 'string',
              },
            },
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema({}),
      400: generateErrorResponseSchema({
        description: 'Invalid input provided',
        errors: [
          {
            title: 'Contact does not have an organization',
          },
        ],
      }),
      404: responses.notFound.generate('Contact'),
    },
  },

  async (req, res) => {
    const {
      params: { contact_id },
      body: { email, redirect_url, resources },
      user,
    } = req;

    let guest: Awaited<ReturnType<OrganizationGuestService['create']>>;
    try {
      guest = await req.services.data.organizationGuest.create({
        contact_id,
        email: email.to,
      });
    } catch (error: any) {
      if (error.status === 404) {
        return res.error(404, { error: 'Contact not found' });
      }
      if (error.status === 400) {
        return res.error(400, {
          error: 'Contact does not have an organization',
        });
      }
      throw error;
    }

    // TODO need to shorten token
    const tplData = await TenantService.getMailThemeData(user.tenant);
    const mailService = new MailService();
    await mailService.send({
      to: email.to,
      subject: email.subject,
      tenant_id: user.tenant,
      template: {
        name: 'public-report-email',
        data: {
          ...tplData,
          link: `${redirect_url}?token=${guest.token}&resource_id=${guest.organization_id}`,
          message: email.message,
        },
      },
    });

    const activityGuest = {
      ...guest,
    };

    delete (activityGuest as any).token;

    await req.services.data.feedLog.create({
      tenant_id: user.tenant,
      created_by: user.id,
      organization_id: guest.organization_id,
      type: resources?.type || 'organization',
      summary: 'Shared Report',
      object_data: {
        ...guest,
        file_id: resources?.id,
      },
    });

    return res.success({});
  }
);
