import {
  apiSchemas,
  generateBulkQueryParam,
  generatePaginatedResponseSchema,
  queries,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getUsers',
  {
    operationId: 'getUsers',
    summary: 'Get Users',
    tags: ['users'],
    security: [{ Bearer: [] }],
    parameters: [
      ...queries.pagination,
      ...generateBulkQueryParam(apiSchemas.UserQueryBiz),
    ],
    responses: {
      200: generatePaginatedResponseSchema(apiSchemas.GetUsers, 'users'),
    },
  },
  async (req, res) => {
    const {
      query: { page, limit, order, search, status, roleId },
    } = req;

    const users = await req.services.biz.user.get(
      undefined,
      { limit, page },
      { order, search, status, roleId }
    );
    // TODO refactor to `data` instead of `users`
    const response = {
      users: users.data,
      pagination: users.pagination,
    };

    await res.success(response);
    return;
  }
);
