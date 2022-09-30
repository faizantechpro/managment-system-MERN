import {
  apiSchemas,
  generateEmptyResponseSchema,
  generateRequestBody,
  generateResponseSchema,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getTeam',
  {
    operationId: 'getTeam',
    summary: 'Get Team',
    tags: ['teams'],
    security: [{ Bearer: [] }],
    parameters: [parameters.teamId],
    responses: {
      200: generateResponseSchema(apiSchemas.TeamAttr),
      404: responses.notFound.generate('Team'),
    },
  },

  permissionsValidator() as any,
  async (req, res) => {
    const {
      params: { teamId },
    } = req;

    try {
      const team = await req.services.biz.team.getOneById(undefined, teamId);

      await res.success(team);
      return;
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Team not found' });
      }
      throw error;
    }
  }
);

export const PUT = operationMiddleware(
  'updateTeam',
  {
    operationId: 'updateTeam',
    summary: 'Update Team',
    tags: ['teams'],
    security: [{ Bearer: [] }],
    parameters: [parameters.teamId],
    requestBody: generateRequestBody(apiSchemas.TeamModifyBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.TeamAttr),
      404: responses.notFound.generate('Team'),
    },
  },

  permissionsValidator() as any,
  async (req, res) => {
    const {
      body,
      params: { teamId },
    } = req;

    try {
      const team = await req.services.biz.team.updateById(
        undefined,
        teamId,
        body
      );

      await res.success(team);
      return;
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Team not found' });
      }
      throw error;
    }
  }
);

export const DELETE = operationMiddleware(
  'deleteTeam',
  {
    operationId: 'deleteTeam',
    summary: 'Delete Team',
    tags: ['teams'],
    security: [{ Bearer: [] }],
    parameters: [parameters.teamId],
    responses: {
      200: generateEmptyResponseSchema(),
      404: responses.notFound.generate('Team'),
    },
  },
  permissionsValidator() as any,
  async (req, res) => {
    const {
      params: { teamId },
    } = req;

    try {
      await req.services.biz.team.deleteById(undefined, teamId);

      await res.success({});
      return;
    } catch (error) {
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Team not found' });
      }
      throw error;
    }
  }
);
