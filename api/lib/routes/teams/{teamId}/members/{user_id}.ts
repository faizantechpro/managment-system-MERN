import {
  apiSchemas,
  generateEmptyResponseSchema,
  generateErrorResponseSchema,
  generateRequestBody,
  generateResponseSchema,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { operationMiddleware } from 'lib/utils';

export const POST = operationMiddleware(
  'createTeamMember',
  {
    operationId: 'createTeamMember',
    summary: 'Create Team Member',
    tags: ['teams'],
    security: [{ Bearer: [] }],
    parameters: [parameters.teamId, parameters.userId],
    requestBody: generateRequestBody(apiSchemas.TeamMemberCreateBiz),
    responses: {
      200: generateResponseSchema(apiSchemas.TeamMemberAttr),
      404: responses.notFound.generate('Team'),
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
    const {
      body,
      params: { teamId, user_id },
    } = req;

    try {
      const teamMember = await req.services.biz.teamMember.createByCompositeIds(
        undefined,
        teamId,
        user_id,
        body
      );

      await res.success(teamMember);
      return;
    } catch (error) {
      if (error instanceof req.exception.Conflict) {
        return res.error(error.status, { error: error.message as any });
      }
      if (error instanceof req.exception.ResourceNotFound) {
        return res.error(error.status, { error: 'Team not found' });
      }
      throw error;
    }
  }
);

export const DELETE = operationMiddleware(
  'deleteTeamMember',
  {
    operationId: 'deleteTeamMember',
    summary: 'Delete Team Member',
    tags: ['teams'],
    security: [{ Bearer: [] }],
    parameters: [parameters.teamId, parameters.userId],
    responses: {
      200: generateEmptyResponseSchema(),
      404: responses.notFound.generate('Team'),
    },
  },

  permissionsValidator() as any,
  async (req, res) => {
    const {
      params: { teamId, user_id },
    } = req;

    try {
      await req.services.biz.teamMember.deleteByCompositeIds(
        undefined,
        teamId,
        user_id
      );

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
