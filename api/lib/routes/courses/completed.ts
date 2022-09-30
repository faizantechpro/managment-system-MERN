import {
  generateResponseSchema,
  operationMiddleware,
} from 'lib/middlewares/openapi';
import { CourseServiceFactory } from 'lib/services';

export const GET = operationMiddleware(
  'coursesCompleted',
  {
    operationId: 'coursesCompleted',
    summary: 'Courses Completed',
    tags: ['courses'],
    security: [{ Bearer: [] }],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        properties: {
          count: {
            type: 'number',
          },
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                course_id: {
                  type: 'string',
                },
                //   started_at: {
                //     type: 'string',
                //   },
                //   completed_at: {
                //     type: 'string',
                //   },
                //   last_attempted_at: {
                //     type: 'string',
                //   },
                CourseModel: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    badge: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                        name: {
                          type: 'string',
                        },
                        description: {
                          type: 'string',
                        },
                        status: {
                          type: 'string',
                        },
                        badge_url: {
                          type: 'string',
                        },
                        deleted: {
                          type: 'boolean',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    },
  },

  async (req, res) => {
    const service = CourseServiceFactory(req.user);
    const completed = await service.getCompletedCoursesInfo();

    return res.json(completed);
  }
);
