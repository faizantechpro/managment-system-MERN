import {
  generateResponseSchema,
  operationMiddleware,
  parameters,
  queries,
  schemas,
} from 'lib/middlewares/openapi';
import { OrganizationFollowerService } from 'lib/services';

export const GET = operationMiddleware(
  'getOrganizationFollowers',
  {
    operationId: 'getOrganizationFollowers',
    summary: 'Get Organization Followers',
    tags: ['organizations'],
    security: [{ Bearer: [] }],
    parameters: [...queries.pagination, parameters.organizationId],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['data', 'pagination'],
        properties: {
          data: {
            type: 'array',
            items: schemas.organizationFollowers,
          },
          pagination: schemas.paginationResponse,
        },
      }),
    },
  },

  async (req, res) => {
    const {
      user,
      params: { organization_id },
      query: { page, limit, ...rest },
    } = req;

    const service = new OrganizationFollowerService(user);
    const followers = await service.getFollowers(
      organization_id,
      {
        page,
        limit,
      },
      rest
    );

    return res.json(followers);
  }
);
