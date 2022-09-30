import {
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
  parameters,
  queries,
  responses,
  schemas,
} from 'lib/middlewares/openapi';

export const GET = operationMiddleware(
  'getReportInsights',
  {
    operationId: 'getReportInsights',
    summary: 'Get Report Insights',
    tags: ['reports'],
    security: [{ Bearer: [] }],
    parameters: [...queries.pagination, parameters.reportId],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['pagination', 'data'],
        properties: {
          pagination: schemas.paginationResponse,
          data: {
            type: 'array',
            items: schemas.reportInsight,
          },
        },
      }),
      404: responses.notFound.generate('Report'),
    },
  },
  async (req, res) => {
    const {
      query: { limit, page },
      params: { report_id },
    } = req;

    const report = await req.services.data.report.getOne(report_id);
    if (!report) {
      return res.error(404, { error: 'Report not found' });
    }

    const reportInsight = await req.services.data.reportInsight.getByReportId(
      report_id,
      { limit, page }
    );

    return res.success(reportInsight);
  }
);

export const POST = operationMiddleware(
  'createReportInsight',
  {
    operationId: 'createReportInsight',
    summary: 'Create Report Insight',
    tags: ['reports'],
    security: [{ Bearer: [] }],
    parameters: [parameters.reportId],
    requestBody: {
      ...generateJSONBase({
        type: 'object',
        required: ['type', 'hidden', 'position'],
        properties: {
          type: {
            type: 'string',
            enum: [
              'DEFAULT',
              'RPMG_ACH',
              'RPMG_CHECK',
              'RPMG_CREDIT_CARD',
              'RPMG_WIRE_TRANSFER',
            ],
          },
          hidden: {
            type: 'boolean',
          },
          position: {
            type: 'number',
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema({}),
      404: responses.notFound.generate('Report'),
    },
  },
  async (req, res) => {
    const {
      body,
      params: { report_id },
    } = req;

    const report = await req.services.data.report.getOne(report_id);
    if (!report) {
      return res.error(404, { error: 'Report not found' });
    }

    const reportInsight = await req.services.data.reportInsight.create({
      ...body,
      report_id: report_id,
    });

    return res.success(reportInsight);
  }
);
