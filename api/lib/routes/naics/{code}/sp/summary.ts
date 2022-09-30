import {
  generateResponseSchema,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getSPSummaryByCode',
  {
    operationId: 'getSPSummaryByCode',
    summary: 'Get S&P Summary by NAICS',
    tags: ['naics'],
    security: [{ Bearer: [] }],
    parameters: [parameters.naicsCode],
    responses: {
      200: generateResponseSchema({
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
      }),
      404: responses.notFound.generate('NAICS'),
    },
  },

  async (req, res) => {
    const {
      params: { code },
    } = req;

    const summary = await req.services.biz.insight.findOneByCode(
      's&p' as const,
      code
    );

    if (!summary) {
      return res.error(404, { error: 'NAICS not found' });
    }

    // TODO find how to restrict based on param and fix type
    await res.success(summary as any);
    return;
  }
);
