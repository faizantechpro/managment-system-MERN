import {
  generateResponseSchema,
  operationMiddleware,
  responses,
} from 'lib/middlewares/openapi';
import { CourseServiceFactory } from 'lib/services';

export const GET = operationMiddleware(
  'getCourseLessonProgress',
  {
    operationId: 'getCourseLessonProgress',
    summary: 'Get Course Lesson Progress',
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
      // by default, attempt to load all lesson progress. use this query for paginated view
      {
        in: 'query',
        name: 'lessonIds',
        required: false,
        schema: {
          type: 'array',
          items: {
            type: 'number',
          },
        },
      },
    ],
    responses: {
      200: generateResponseSchema({
        type: 'array',
        items: {
          type: 'object',
          required: [],
          properties: {
            id: {
              type: 'number',
            },
            user_id: {
              type: 'string',
            },
            lesson_id: {
              type: 'number',
            },
            page_id: {
              type: 'number',
            },
            progress: {
              type: 'number',
            },
            status: {
              type: 'string',
              enum: ['in_progress', 'completed', 'failed', 'pending'],
            },
            is_favorited: {
              type: 'number',
            },
            attempts: {
              type: 'number',
            },
            points: {
              type: 'number',
            },
          },
        },
      }),
      404: responses.notFound.generate('Course'),
    },
  },

  async (req, res) => {
    const {
      params: { course_id },
      query: { lessonIds },
    } = req;

    const service = CourseServiceFactory(req.user);
    const course = await service.findCourse(course_id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const lessonProgress = await service.getLessonProgress(
      course_id,
      lessonIds
    );

    return res.json(lessonProgress);
  }
);
