import {
  generateResponseSchema,
  parameters,
  queries,
  schemas,
  operationMiddleware,
} from 'lib/middlewares/openapi';
import { ContactFollowerService } from 'lib/services';

export const GET = operationMiddleware(
  'getContactFollowers',
  {
    operationId: 'getContactFollowers',
    summary: `Get contact's followers list`,
    tags: ['contacts'],
    security: [{ Bearer: [] }],
    parameters: [...queries.pagination, parameters.contactId],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['data', 'pagination'],
        properties: {
          data: {
            type: 'array',
            items: schemas.contactFollowers,
          },
          pagination: schemas.paginationResponse,
        },
      }),
    },
  },

  async (req, res) => {
    const {
      user,
      params: { contact_id },
      query: { page, limit, ...rest },
    } = req;

    const service = new ContactFollowerService(user);
    const followers = await service.getFollowers(
      contact_id,
      {
        page,
        limit,
      },
      rest
    );

    return res.json(followers);
  }
);
