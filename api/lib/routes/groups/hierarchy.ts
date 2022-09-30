import { apiSchemas, generateResponseSchema } from 'lib/middlewares/openapi';
import { operationMiddleware } from 'lib/utils';

export const GET = operationMiddleware(
  'getGroupHierarchy',
  {
    operationId: 'getGroupHierarchy',
    summary: 'Get Group Hierarchy',
    tags: ['groups'],
    security: [{ Bearer: [] }],
    parameters: [],
    responses: {
      200: generateResponseSchema({
        type: 'array',
        items: apiSchemas.GroupAttr,
      }),
    },
  },

  async (req, res) => {
    try {
      const hierarchy = await req.services.biz.group.getFullHierarchy(
        undefined
      );

      await res.success(hierarchy as any);
      return;
    } catch (error) {
      throw error;
    }
  }
);
