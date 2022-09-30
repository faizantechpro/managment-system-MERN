import {
  generateResponseSchema,
  operationMiddleware,
  responses,
} from 'lib/middlewares/openapi';
import { CourseServiceFactory } from 'lib/services';

export const POST = operationMiddleware(
  'completeCourse',
  {
    operationId: 'completeCourse',
    summary: 'Complete Course',
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
        required: [],
        properties: {
          // Progress model
          id: {
            type: 'string',
          },
          user_id: {
            type: 'string',
          },
          course_id: {
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
      404: responses.notFound.generate('Course'),
    },
  },

  async (req, res) => {
    const {
      user: { id: userId },
      params: { course_id },
    } = req;
    const service = CourseServiceFactory(req.user);
    const course = await service.findCourse(course_id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const courseComplete = await service.complete(course_id);

    await req.services.data.feedLog.create({
      tenant_id: req.user.tenant,
      type: 'courseCompleted',
      created_by: userId,
      summary: 'Course completed',
      object_data: {
        id: course_id,
        name: course.dataValues.name,
        required_modules: courseComplete.required_modules,
      },
    });

    return res.json(courseComplete);
  }
);
