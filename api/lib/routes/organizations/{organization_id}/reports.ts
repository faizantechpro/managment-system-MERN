import { ReportBiz } from 'lib/biz';
import {
  generateErrorResponseSchema,
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
  parameters,
  queries,
  responses,
  schemas,
} from 'lib/middlewares/openapi';
import { organizationServiceFactory, reportServiceFactory } from 'lib/services';
import { TenantService } from '../../../services/tenant';

export const GET = operationMiddleware(
  'getOrganizationReports',
  {
    'x-authz': {
      allowedScopes: ['', 'profile', 'guest', 'impersonation'],
    },
    operationId: 'getOrganizationReports',
    summary: 'Get Reports for an Organization',
    tags: ['reports'],
    security: [{ Bearer: [] }],
    parameters: [
      ...queries.pagination,
      {
        in: 'query',
        name: 'type',
        schema: {
          type: 'string',
          enum: ['TREASURY'],
        },
      },
      parameters.organizationId,
    ],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['pagination', 'data'],
        properties: {
          pagination: schemas.paginationResponse,
          data: {
            type: 'array',
            items: {
              type: 'object',
              required: [
                'id',
                'organization_id',
                'created_by',
                'type',
                'input',
                'month',
              ],
              properties: {
                id: {
                  type: 'string',
                },
                organization_id: {
                  type: 'string',
                },
                created_by: {
                  type: 'string',
                },
                file_id: {
                  type: 'string',
                },
                type: {
                  type: 'string',
                  enum: ['TREASURY'],
                },
                input: schemas.reportInput,
                month: {
                  description: 'In "YYYYMM" format',
                  type: 'string',
                },
                output: schemas.reportOutput,
              },
            },
          },
        },
      }),
      404: responses.notFound.generate('Organization'),
    },
  },

  async (req, res) => {
    const {
      params: { organization_id },
      query,
      user,
    } = req;

    const organizationService = organizationServiceFactory(user);
    const organization = await organizationService.getOrganizationById(
      organization_id
    );

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const reportService = reportServiceFactory(user);
    const reports = await reportService.getByOrganization(
      organization_id,
      query
    );

    return res.json({
      ...reports,
      data: await Promise.all(
        reports.data.map(async (data) => {
          const output = await ReportBiz.getOutput(data.input);
          return { ...data, output };
        })
      ),
    });
  }
);

export const POST = operationMiddleware(
  'createOrganizationReport',
  {
    operationId: 'createOrganizationReport',
    summary: 'Create Report for an Organization',
    tags: ['reports'],
    security: [{ Bearer: [] }],
    parameters: [parameters.organizationId],
    requestBody: {
      ...generateJSONBase({
        type: 'object',
        required: ['input', 'month'],
        properties: {
          input: schemas.reportInput,
          month: {
            description: 'In "YYYYMM" format',
            type: 'string',
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: [
          'id',
          'organization_id',
          'created_by',
          'type',
          'input',
          'month',
          'output',
        ],
        properties: {
          id: {
            type: 'string',
          },
          organization_id: {
            type: 'string',
          },
          created_by: {
            type: 'string',
          },
          file_id: {
            type: 'string',
          },
          type: {
            type: 'string',
            enum: ['TREASURY'],
          },
          input: schemas.reportInput,
          month: {
            description: 'In "YYYYMM" format',
            type: 'string',
          },
          output: schemas.reportOutput,
        },
      }),
      404: responses.notFound.generate('Organization'),
      422: generateErrorResponseSchema({
        description: 'Not Processable',
        errors: [
          {
            title: 'Report not processable',
          },
        ],
      }),
    },
  },

  async (req, res) => {
    const {
      params: { organization_id },
      user,
      body,
    } = req;

    const organizationService = organizationServiceFactory(user);
    const organization = await organizationService.getOrganizationById(
      organization_id
    );
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const tenant = await TenantService.getTenantById(organization.tenant_id);

    const reportInput = {
      ...body.input,
      date: ReportBiz.parseDate(body.month),
      // always set these fields to avoid errors and unexpected behavior
      logo_white: tenant.settings.light_theme_logo,
      logo_dark: tenant.logo,
      proposed_bank_name: tenant.name,
    };

    const reportResult = await ReportBiz.generate(reportInput, user);

    if (!reportResult) {
      return res.status(422).json({ error: 'Report not processable' });
    }

    const reportBody = {
      ...body,
      ...{ organization_id },
    };

    const reportService = reportServiceFactory(user);
    const report = await reportService.create({
      ...reportBody,
      ...reportResult,
      type: reportBody.input.type,
      tenant_id: req.user.tenant,
    });

    await req.services.data.feedFile.addFile(
      {
        organization_id: organization_id,
        contact_id: null,
        deal_id: null,
        file_id: reportResult.file_id,
        tenant_id: req.user.tenant,
      },
      req.user
    );

    return res.json({
      ...report,
      output: reportResult.output,
    });
  }
);
