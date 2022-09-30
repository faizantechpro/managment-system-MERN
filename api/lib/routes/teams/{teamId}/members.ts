import {
  apiSchemas,
  generatePaginatedResponseSchema,
  operationMiddleware,
  parameters,
  queries,
  responses,
} from 'lib/middlewares/openapi';

export const GET = operationMiddleware(
  'getTeamMembers',
  {
    operationId: 'getTeamMembers',
    summary: 'Get Team Members',
    tags: ['teams'],
    security: [{ Bearer: [] }],
    parameters: [...queries.pagination, parameters.teamId],
    responses: {
      200: generatePaginatedResponseSchema(apiSchemas.GetTeamMembers),
      404: responses.notFound.generate('Team'),
    },
  },
  async (req, res) => {
    const {
      query,
      params: { teamId },
    } = req;

    try {
      const members = await req.services.biz.teamMember.getByTeamId(
        undefined,
        teamId,
        query
      );
      await res.success(members);
      return;
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Team not found' });
      }
      throw error;
    }
  }
);
