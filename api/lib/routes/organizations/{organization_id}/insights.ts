import {
  generateErrorResponseSchema,
  generateResponseSchema,
  operationMiddleware,
  parameters,
  responses,
  schemas,
} from 'lib/middlewares/openapi';

export const GET = operationMiddleware(
  'getOrganizationInsights',
  {
    operationId: 'getOrganizationInsights',
    summary: 'Get Organization Insights',
    tags: ['organizations', 'insights'],
    security: [{ Bearer: [] }],
    parameters: [parameters.organizationId],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        properties: {
          rpmg: schemas.rpmgTransactionSummary,
          sp: {
            type: 'object',
            required: ['id'],
            properties: {
              id: {
                type: 'string',
              },
              days_sales_out: {
                type: 'number',
              },
              days_payable_out: {
                type: 'number',
              },
              working_capital: {
                type: 'number',
              },
              working_capital_ratio: {
                type: 'number',
              },
            },
          },
        },
      }),
      404: responses.notFound.generate('Organization', 'Insights'),
      409: generateErrorResponseSchema({
        description: 'Conflict',
        errors: [
          {
            title: 'Organization requires NAICS',
          },
        ],
      }),
    },
  },

  async (req, res) => {
    const {
      params: { organization_id },
    } = req;

    const organization =
      await req.services.data.organization.getOrganizationById(organization_id);
    if (!organization) {
      return res.error(404, { error: 'Organization not found' });
    }

    const insights =
      await req.services.biz.insight.generateOrganizationInsights(organization);

    if (!insights) {
      return res.error(409, { error: 'Organization requires NAICS' });
    }

    // TODO fix this type
    await res.success(insights as any);
    return;
  }
);
