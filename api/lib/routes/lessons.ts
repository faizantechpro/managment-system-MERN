import {
  apiSchemas,
  generateBulkQueryParam,
  generatePaginatedResponseSchema,
  queries,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getLessons',
  {
    operationId: 'getLessons',
    summary: 'Get Lessons',
    tags: ['lessons'],
    security: [{ Bearer: [] }],
    parameters: [
      ...queries.pagination,
      ...generateBulkQueryParam(apiSchemas.GetLessonsQuery),
      queries.self,
    ],
    responses: {
      200: generatePaginatedResponseSchema(apiSchemas.LessonAttr),
    },
  },
  async (req, res) => {
    const {
      query: { limit, page, self, order, ...rest },
    } = req;

    const lessons = await req.services.biz.lesson.get(
      { self },
      { limit, page },
      {
        order: order?.map((item) => JSON.parse(item as any)),
        ...rest,
      }
    );

    await res.success(lessons);
  }
);
