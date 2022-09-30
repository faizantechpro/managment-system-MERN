import {
  apiSchemas,
  generateBulkQueryParam,
  generatePaginatedResponseSchema,
  parameters,
  queries,
  responses,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getCategoryCourses',
  {
    operationId: 'getCategoryCourses',
    summary: 'Get Category Courses',
    tags: ['categories', 'courses'],
    security: [{ Bearer: [] }],
    parameters: [
      parameters.categoryId,
      ...queries.pagination,
      ...generateBulkQueryParam(apiSchemas.GetCategoryCoursesQuery),
      queries.self,
    ],
    responses: {
      200: generatePaginatedResponseSchema(apiSchemas.CourseAttr),
      404: responses.notFound.generate('Category'),
    },
  },

  async (req, res) => {
    const {
      params: { categoryId },
      query: { favorites, limit, order, page, progress, self },
    } = req;

    try {
      const courses = await req.services.biz.category.getCoursesById(
        { self },
        categoryId,
        { limit, page },
        {
          favorites,
          order: order?.map((item) => JSON.parse(item as any)),
          progress,
        }
      );

      await res.success(courses);
      return;
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Category not found' });
      }
      throw error;
    }
  }
);
