import {
  generateResponseSchema,
  operationMiddleware,
  responses,
} from 'lib/middlewares/openapi';
import { CourseServiceFactory } from 'lib/services';

export const GET = operationMiddleware(
  'getCourseProgress',
  {
    operationId: 'getCourseProgress',
    summary: 'Get Course Progress',
    tags: ['courses'],
    security: [{ Bearer: [] }],
    parameters: [
      {
        in: 'path',
        name: 'course_id',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['user_id', 'course_id', 'status'],
        properties: {
          id: {
            description: 'Progress id',
            type: 'string',
          },
          user_id: {
            description: 'User id',
            type: 'string',
          },
          course_id: {
            description: 'Course id',
            type: 'string',
          },
          status: {
            description: 'Overall progress status',
            type: 'string',
            enum: ['in_progress', 'completed', 'pending'],
          },
          completed_modules: {
            description: 'Required course modules completed by user count',
            type: 'number',
          },
          required_modules: {
            description: 'Required course modules count',
            type: 'number',
          },
          overall_progress: {
            description: 'Overall course progress by user in percentage',
            type: 'number',
          },
          // TODO investigate how to represent date
          // started_at: {
          //   type: 'string',
          // },
          // completed_at: {
          //   type: 'string',
          // },
          // last_attempted_at: {
          //   type: 'string',
          // },
        },
      }),
      // TODO enforce error response types as well
      404: responses.notFound.generate('Course'),
    },
  },

  async (req, res) => {
    const {
      params: { course_id },
    } = req;

    const service = CourseServiceFactory(req.user);
    const course = await service.findCourse(course_id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const courseProgress = await service.getProgress(course_id);

    return res.json(courseProgress);
  }
);
