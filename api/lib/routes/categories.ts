import {
  apiSchemas,
  generateBulkQueryParam,
  generatePaginatedResponseSchema,
  generateRequestBody,
  generateResponseSchema,
  queries,
} from 'lib/middlewares/openapi';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { operationMiddleware } from 'lib/utils';
import { permissions } from 'lib/utils/permissions';

export const GET = operationMiddleware(
  'getCategories',
  {
    operationId: 'getCategories',
    summary: 'Get Categories',
    tags: ['categories'],
    security: [{ Bearer: [] }],
    parameters: [
      ...queries.pagination,
      ...generateBulkQueryParam(apiSchemas.GetCategoriesQuery),
    ],
    responses: {
      200: generatePaginatedResponseSchema(apiSchemas.GetCategory),
    },
  },

  async (req, res) => {
    const {
      query: { limit, order, page, search, extraData },
    } = req;

    try {
      const categories = await req.services.biz.category.get(
        undefined,
        { limit, page },
        {
          extraData,
          order,
          search,
        }
      );

      await res.success(categories);
      return;
    } catch (error) {
      if (error instanceof req.exception.Forbidden) {
        // TODO this may be a bug? keeping old behavior..
        return res.success(undefined as any);
      }
      throw error;
    }
  }
);

export const POST = operationMiddleware(
  'createCategory',
  {
    operationId: 'createCategory',
    summary: 'Create Category',
    tags: ['categories'],
    security: [{ Bearer: [] }],
    requestBody: generateRequestBody(apiSchemas.CategoryCreateBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.CategoryAttr),
    },
  },

  permissionsValidator(permissions.categories.create) as any,
  async (req, res) => {
    const { body } = req;

    try {
      const category = await req.services.biz.category.create(undefined, body);

      await res.success(category);
      return;
    } catch (error) {
      throw error;
    }
  }
);
