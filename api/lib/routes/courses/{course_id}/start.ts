import {
  generateErrorResponseSchema,
  generateResponseSchema,
  operationMiddleware,
  responses,
} from 'lib/middlewares/openapi';
import { CourseServiceFactory } from 'lib/services';

export const POST = operationMiddleware(
  'startCourse',
  {
    operationId: 'startCourse',
    summary: 'Start a Course',
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
      404: responses.notFound.generate('Course'),
      409: generateErrorResponseSchema({
        description: 'Conflict',
        errors: [
          {
            title: 'Course already started',
          },
        ],
      }),
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

    const courseProgress = await service.getProgress(course_id);
    if (courseProgress.status !== 'pending') {
      return res.status(409).json({ error: 'Course already started' });
    }

    const courseStart = await service.start(course_id);

    await req.services.data.feedLog.create({
      tenant_id: req.user.tenant,
      type: 'courseStarted',
      created_by: userId,
      summary: 'Started a course',
      object_data: {
        id: course_id,
        name: course.dataValues.name,
        required_modules: courseStart.required_modules,
      },
    });

    return res.json(courseStart);
  }
);
