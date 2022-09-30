import {
  apiSchemas,
  generateErrorResponseSchema,
  generatePaginatedResponseSchema,
  generateRequestBody,
  generateResponseSchema,
  queries,
} from 'lib/middlewares/openapi';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getTeams',
  {
    operationId: 'getTeams',
    summary: 'Get Teams',
    tags: ['teams'],
    security: [{ Bearer: [] }],
    parameters: [...queries.pagination],
    responses: {
      200: generatePaginatedResponseSchema(apiSchemas.TeamAttr),
    },
  },

  permissionsValidator() as any,
  async (req, res) => {
    const { query } = req;

    const teams = await req.services.biz.team.get(undefined, query);

    await res.success(teams);
    return;
  }
);

export const POST = operationMiddleware(
  'createTeam',
  {
    operationId: 'createTeam',
    summary: 'Create Team',
    tags: ['teams'],
    security: [{ Bearer: [] }],
    requestBody: generateRequestBody(apiSchemas.TeamCreateBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.CreateTeam),
      409: generateErrorResponseSchema({
        description: 'Conflict',
        errors: [
          {
            title: 'maximum of one manager is allowed',
          },
        ],
      }),
    },
  },

  permissionsValidator() as any,
  async (req, res) => {
    const { body } = req;

    try {
      const team = await req.services.biz.team.create(undefined, body);

      await res.success(team);
      return;
    } catch (error) {
      if (error instanceof req.exception.Conflict) {
        return res.error(error.status, { error: error.message as any });
      }
      throw error;
    }
  }
);
