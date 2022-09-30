import {
  generateResponseSchema,
  operationMiddleware,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { QuizSubmissionService } from 'lib/services';

export const GET = operationMiddleware(
  'getQuizSubmission',
  {
    operationId: 'getQuizSubmission',
    summary: 'Get a Quiz Submission',
    tags: ['quizzes'],
    security: [{ Bearer: [] }],
    parameters: [parameters.quizId, parameters.submissionId],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: [],
        properties: {
          id: {
            type: 'string',
          },
          user_id: {
            type: 'string',
          },
          quiz_id: {
            type: 'string',
          },
          status: {
            type: 'string',
            enum: ['in-progress', 'pass', 'fail'],
          },
          score: {
            type: 'number',
            example: '75.5',
          },
        },
      }),
      404: responses.notFound.generate('Quiz submission'),
    },
  },

  async (req, res) => {
    const {
      user: { id: userId },
      params: { quiz_id, submission_id },
    } = req;

    const quizSubmission = await QuizSubmissionService.getOne(
      submission_id,
      quiz_id,
      userId
    );
    if (!quizSubmission) {
      return res.status(404).json({ error: 'Quiz submission not found' });
    }

    return res.json(quizSubmission);
  }
);
