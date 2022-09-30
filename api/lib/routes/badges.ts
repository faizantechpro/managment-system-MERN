import {
  apiSchemas,
  generatePaginatedResponseSchema,
  generateQueryParam,
  generateRequestBody,
  generateResponseSchema,
  queries,
} from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getBadges',
  {
    operationId: 'getBadges',
    summary: 'Get Badges',
    tags: ['badges'],
    security: [{ Bearer: [] }],
    parameters: [
      ...queries.pagination,
      queries.search,
      generateQueryParam('order', false, {
        type: 'string',
      }),
    ],
    responses: {
      200: generatePaginatedResponseSchema(apiSchemas.BadgeAttr),
    },
  },
  async (req, res) => {
    const {
      query: { page, limit, search, order },
    } = req;

    const badges = await req.services.biz.badge.get(
      undefined,
      { limit, page },
      { search, order }
    );

    await res.success(badges);
  }
);

export const POST = operationMiddleware(
  'createBadge',
  {
    operationId: 'createBadge',
    summary: 'Create a Badge',
    tags: ['badges'],
    security: [{ Bearer: [] }],
    parameters: [],
    requestBody: generateRequestBody(apiSchemas.BadgeModifyBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.BadgeAttr),
    },
  },
  async (req, res) => {
    const { body } = req;

    const badge = await req.services.biz.badge.create(undefined, body);

    await res.success(badge);
  }
);
