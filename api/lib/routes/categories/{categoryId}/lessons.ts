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
  'getCategoryLessons',
  {
    operationId: 'getCategoryLessons',
    summary: 'Get Category Lessons',
    tags: ['categories', 'lessons'],
    security: [{ Bearer: [] }],
    parameters: [
      parameters.categoryId,
      ...queries.pagination,
      ...generateBulkQueryParam(apiSchemas.GetCategoryLessonsQuery),
      queries.self,
    ],
    responses: {
      200: generatePaginatedResponseSchema(apiSchemas.LessonAttr),
      404: responses.notFound.generate('Category'),
    },
  },

  async (req, res) => {
    const {
      params: { categoryId },
      query: { favorites, limit, order, page, progress, self },
    } = req;

    try {
      const lessons = await req.services.biz.category.getLessonsById(
        { self },
        categoryId,
        { limit, page },
        {
          favorites,
          order: order?.map((item) => JSON.parse(item as any)),
          progress,
        }
      );

      await res.success(lessons);
      return;
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Category not found' });
      }
      throw error;
    }
  }
);
