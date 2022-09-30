import {
  generateResponseSchema,
  operationMiddleware,
  parameters,
  responses,
  schemas,
} from 'lib/middlewares/openapi';

import { MerchantReportService } from 'lib/services/merchantReport';

export const GET = operationMiddleware(
  'getMerchantReport',
  {
    operationId: 'getMerchantReport',
    summary: 'Get merchant report',
    tags: ['reports'],
    security: [{ Bearer: [] }],
    parameters: [parameters.siteId],
    responses: {
      200: generateResponseSchema(schemas.merchantReport),
      404: responses.notFound.generate('MerchantReport'),
    },
  },

  async (req, res) => {
    const {
      params: { site_id },
      query: { fromDate, toDate },
    } = req;

    const merchantReportService = new MerchantReportService();
    const response = await merchantReportService.getMerchantReport(
      site_id,
      fromDate,
      toDate
    );

    if (!response) {
      return res.error(404, { error: 'MerchantReport not found' });
    }

    return res.success(response);
  }
);
