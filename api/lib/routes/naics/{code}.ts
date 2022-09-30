import {
  generateResponseSchema,
  operationMiddleware,
  parameters,
  responses,
  schemas,
} from 'lib/middlewares/openapi';

export const GET = operationMiddleware(
  'getNAICSByCode',
  {
    operationId: 'getNAICSByCode',
    summary: 'Get a NAICS',
    tags: ['naics'],
    security: [{ Bearer: [] }],
    parameters: [parameters.naicsCode],
    responses: {
      200: generateResponseSchema(schemas.naics),
      404: responses.notFound.generate('NAICS'),
    },
  },

  async (req, res) => {
    const {
      params: { code },
    } = req;

    try {
      const naics = await req.services.biz.naics.getByCode(code);

      return res.success(naics);
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'NAICS not found' });
      }

      throw error;
    }
  }
);
