import {
  generateResponseSchema,
  operationMiddleware,
  queries,
  schemas,
} from 'lib/middlewares/openapi';

export const GET = operationMiddleware(
  'getNAICS',
  {
    operationId: 'getNAICS',
    summary: 'Get NAICS',
    tags: ['naics'],
    security: [{ Bearer: [] }],
    parameters: [...queries.pagination, queries.search],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['pagination', 'data'],
        properties: {
          pagination: schemas.paginationResponse,
          data: {
            type: 'array',
            items: schemas.naics,
          },
        },
      }),
    },
  },

  async (req, res) => {
    const { limit, page, search } = req.query;

    const data = await req.services.biz.naics.get({ limit, page }, { search });

    return res.success(data);
  }
);
