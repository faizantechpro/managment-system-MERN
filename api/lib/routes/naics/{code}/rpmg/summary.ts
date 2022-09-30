import {
  generateResponseSchema,
  operationMiddleware,
  parameters,
  responses,
  schemas,
} from 'lib/middlewares/openapi';
import { rpmgServiceFactory } from 'lib/services';

export const GET = operationMiddleware(
  'getRPMGSummaryByCode',
  {
    operationId: 'getRPMGSummaryByCode',
    summary: 'Get RPMG Summary By NAICS',
    tags: ['naics'],
    security: [{ Bearer: [] }],
    parameters: [parameters.naicsCode],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: schemas.rpmgVertical.required,
        properties: {
          ...schemas.rpmgVertical.properties,
          naics: schemas.naics,
          summary: schemas.rpmgSummary,
          transaction_summary: {
            type: 'array',
            items: {
              type: 'object',
              required: schemas.rpmgTransactionSummary.required,
              properties: {
                ...schemas.rpmgTransactionSummary.properties,
                transaction: schemas.rpmgTransaction,
              },
            },
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

    const summary = (await req.services.biz.insight.findOneByCode(
      'rpmg' as const,
      code
    )) as Awaited<
      ReturnType<ReturnType<typeof rpmgServiceFactory>['getDefaultSummary']>
    >;

    // if this happens, there's a missing migration/seed
    if (!summary) {
      return res.error(404, { error: 'NAICS not found' });
    }

    return res.success(summary);
  }
);
