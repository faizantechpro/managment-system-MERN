import {
  generateErrorResponseSchema,
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
  parameters,
  queries,
  responses,
  schemas,
} from 'lib/middlewares/openapi';
import {
  QuizQuestionService,
  QuizService,
  QuizSubmissionService,
} from 'lib/services';

export const GET = operationMiddleware(
  'getQuizSubmissions',
  {
    operationId: 'getQuizSubmissions',
    summary: 'Get Quiz Submissions',
    tags: ['quizzes'],
    security: [{ Bearer: [] }],
    parameters: [parameters.quizId, ...queries.pagination],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['pagination', 'data'],
        properties: {
          pagination: schemas.paginationResponse,
          data: {
            type: 'array',
            items: {
              type: 'object',
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
            },
          },
        },
      }),
      404: responses.notFound.generate('Quiz'),
    },
  },

  async (req, res) => {
    const {
      user: { id: userId },
      params: { quiz_id },
      query,
    } = req;

    const quiz = await QuizService.getQuiz(quiz_id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quizSubmissions = await QuizSubmissionService.get(
      quiz_id,
      userId,
      query
    );

    return res.json(quizSubmissions);
  }
);

export const POST = operationMiddleware(
  'createQuizSubmission',
  {
    operationId: 'createQuizSubmission',
    summary: 'Create Quiz Submission',
    tags: ['quizzes'],
    security: [{ Bearer: [] }],
    parameters: [parameters.quizId],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        additionalProperties: false,
        required: ['answers'],
        properties: {
          answers: {
            type: 'array',
            items: {
              oneOf: [
                {
                  type: 'object',
                  description: 'multiple choice answer',
                  required: ['id'],
                  properties: {
                    question_id: {
                      type: 'string',
                    },
                    id: {
                      type: 'string',
                      description: 'multiple choice id',
                    },
                  },
                },
              ],
            },
          },
        },
      }),
    },
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
      400: generateErrorResponseSchema({
        description: 'Bad Request',
        errors: [{ title: 'Quiz not yet published' }],
      }),
      404: responses.notFound.generate('Quiz'),
      // in case we attempt to grade answers with a new format
      422: generateErrorResponseSchema({
        description: 'Not Processable',
        errors: [{ title: 'Submission not processable' }],
      }),
    },
  },

  async (req, res) => {
    const {
      user: { id: userId },
      params: { quiz_id },
      body: { answers },
    } = req;

    const quiz = await QuizService.getQuiz(quiz_id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const { status, max_attempts, minimum_score } = quiz;
    if (status !== 'published') {
      return res.status(400).json({ error: 'Quiz not yet published' });
    }

    const countSubmission = await QuizSubmissionService.count(quiz_id, userId);

    if (max_attempts && countSubmission >= max_attempts) {
      return res.status(400).json({ error: 'exceeded the number of attempts' });
    }

    const { data: questions } = await QuizQuestionService.getAllByQuizId(
      quiz_id
    );

    const isValidAnswerSet =
      // must have same length as question set without duplicates
      questions.length ===
      answers
        .map(({ question_id }) => question_id)
        .filter((questionId, idx, self) => idx === self.indexOf(questionId))
        .length;
    if (!isValidAnswerSet) {
      // TODO openapi schema should accept multiple errors, create a helper function
      return res.status(400).json({ error: 'Not all questions were answered' });
    }

    // for now, only grade multiple choice
    const allAreMultipleChoice = questions.every(({ qtype }) => qtype === 'mc');
    if (!allAreMultipleChoice) {
      return res.status(422).json({ error: 'Submission not processable' });
    }

    const totalPoints = questions.reduce((acc, { points }) => {
      return acc + points;
    }, 0);
    const submissionPoints = answers.reduce((acc, answer) => {
      // shouldn't be null, validity is ensured
      const { qoption, points } = questions.find(
        ({ id }) => id === answer.question_id
      )!;

      const isCorrect = qoption.find(({ id }) => id === answer.id)?.correct;

      return isCorrect ? acc + points : acc;
    }, 0);

    const score = (submissionPoints / totalPoints) * 100;

    const submission = {
      tenant_id: req.user.tenant,
      user_id: userId,
      quiz_id,
      status: score >= minimum_score ? ('pass' as const) : ('fail' as const),
      score,
    };

    const newSubmission = await QuizSubmissionService.create(submission);

    return res.json(newSubmission);
  }
);
