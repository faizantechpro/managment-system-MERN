import {
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
  parameters,
  responses,
  schemas,
} from 'lib/middlewares/openapi';

export const GET = operationMiddleware(
  'getReportInsight',
  {
    operationId: 'getReportInsight',
    summary: 'Get a Report Insight',
    tags: ['reports'],
    security: [{ Bearer: [] }],
    parameters: [parameters.reportId, parameters.insightId],
    responses: {
      200: generateResponseSchema(schemas.reportInsight),
      404: responses.notFound.generate('Report', 'Insight'),
    },
  },
  async (req, res) => {
    const {
      params: { report_id, insight_id },
    } = req;

    const report = await req.services.data.report.getOne(report_id);
    if (!report) {
      return res.error(404, { error: 'Report not found' });
    }

    const reportInsight = await req.services.data.reportInsight.getOne(
      insight_id
    );
    if (!reportInsight) {
      return res.error(404, { error: 'Insight not found' });
    }

    return res.success(reportInsight);
  }
);

export const PUT = operationMiddleware(
  'updateReportInsight',
  {
    operationId: 'updateReportInsight',
    summary: 'Update a Report Insight',
    tags: ['reports'],
    security: [{ Bearer: [] }],
    parameters: [parameters.reportId, parameters.insightId],
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
      200: generateResponseSchema({
        type: 'object',
      }),
      404: responses.notFound.generate('Report', 'Insight'),
    },
  },
  async (req, res) => {
    const {
      body,
      params: { report_id, insight_id },
    } = req;

    const report = await req.services.data.report.getOne(report_id);
    if (!report) {
      return res.error(404, { error: 'Report not found' });
    }

    const reportInsight = await req.services.data.reportInsight.getOne(
      insight_id
    );
    if (!reportInsight) {
      return res.error(404, { error: 'Insight not found' });
    }

    await req.services.data.reportInsight.update(insight_id, body);

    return res.success({});
  }
);

export const DELETE = operationMiddleware(
  'deleteReportInsight',
  {
    operationId: 'deleteReportInsight',
    summary: 'Delete a Report Insight',
    tags: ['reports'],
    security: [{ Bearer: [] }],
    parameters: [parameters.reportId, parameters.insightId],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        properties: {},
      }),
      404: responses.notFound.generate('Report', 'Insight'),
    },
  },
  async (req, res) => {
    const {
      params: { report_id, insight_id },
    } = req;

    const report = await req.services.data.report.getOne(report_id);
    if (!report) {
      return res.error(404, { error: 'Report not found' });
    }

    const reportInsight = await req.services.data.reportInsight.getOne(
      insight_id
    );
    if (!reportInsight) {
      return res.error(404, { error: 'Insight not found' });
    }

    await req.services.data.reportInsight.delete(insight_id);

    return res.success({});
  }
);
