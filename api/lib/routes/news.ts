import {
  generateResponseSchema,
  operationMiddleware,
} from 'lib/middlewares/openapi';
import { newsFactory, NewsService } from 'lib/services/news';

export const GET = operationMiddleware(
  'getNews',
  {
    operationId: 'getNews',
    summary: 'Get News getNews',
    tags: ['news', 'headlines'],
    security: [{ Bearer: [] }],
    parameters: [
      {
        in: 'query',
        name: 'name',
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['data'],
        properties: {},
      }),
    },
  },

  async (req, res) => {
    const outlet: NewsService =
      <NewsService>process.env.NEWSOUTLET || 'newsapi';

    const newsService = newsFactory(outlet);

    const result = await newsService.getTopHeadlines(req.query);

    if (result.error) {
      return res.status(400).json();
    }

    res.success(result);
  }
);
