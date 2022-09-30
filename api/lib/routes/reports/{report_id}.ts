import { ReportBiz } from 'lib/biz';
import {
  generateResponseSchema,
  operationMiddleware,
  parameters,
  responses,
} from 'lib/middlewares/openapi';

export const GET = operationMiddleware(
  'getReport',
  {
    // TODO eventually allow access from all valid tokens
    'x-authz': {
      requiredScope: 'guest',
    },
    operationId: 'getReport',
    summary: 'Get a report',
    tags: ['reports'],
    security: [{ Bearer: [] }],
    parameters: [parameters.reportId],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        properties: {},
      }),
      404: responses.notFound.generate('Report'),
    },
  },

  async (req, res) => {
    const {
      params: { report_id },
    } = req;

    const report = await req.services.data.report.getOne(report_id);
    if (!report) {
      return res.error(404, { error: 'Report not found' });
    }

    const output = await ReportBiz.getOutput(report.input);

    return res.success({
      ...report,
      output,
    });
  }
);
