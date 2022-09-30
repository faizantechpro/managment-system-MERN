import {
  apiSchemas,
  generateBulkQueryParam,
  generatePaginatedResponseSchema,
  queries,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getCourses',
  {
    operationId: 'getCourses',
    summary: 'Get Courses',
    tags: ['courses'],
    security: [{ Bearer: [] }],
    parameters: [
      ...queries.pagination,
      ...generateBulkQueryParam(apiSchemas.GetCoursesQuery),
      queries.self,
    ],
    responses: {
      200: generatePaginatedResponseSchema(apiSchemas.GetCourses),
    },
  },
  async (req, res) => {
    const {
      query: { limit, page, self, order, ...rest },
    } = req;

    const courses = await req.services.biz.course.get(
      { self },
      { limit, page },
      {
        order: order?.map((item) => JSON.parse(item as any)),
        ...rest,
      }
    );

    await res.success(courses);
  }
);
