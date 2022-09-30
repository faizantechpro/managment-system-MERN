import { QuizSubmissionCreateDAO } from 'lib/middlewares/sequelize';
import { v4 as uuidv4 } from 'uuid';

import { QuizSubmission } from '../database';
import { QuizSubmissionAttributes } from '../database/models/quiz-submission';
import { Pagination } from '../types/items';

export class QuizSubmissionService {
  static async get(quizId: string, userId: string, pagination: Pagination) {
    const { limit, page } = pagination;

    const { count, rows } = await QuizSubmission.findAndCountAll({
      where: {
        quiz_id: quizId,
        user_id: userId,
      },
      limit,
      offset: limit * (page - 1),
    });

    return {
      data: rows.map((row) => row.dataValues),
      pagination: {
        limit,
        page,
        totalPages: Math.ceil(count / limit),
        count,
      },
    };
  }

  static async getOne(id: string, quizId: string, userId: string) {
    const quizSubmission = await QuizSubmission.findOne({
      where: {
        id,
        user_id: userId,
      },
    });

    return quizSubmission?.dataValues;
  }

  static async create(payload: QuizSubmissionCreateDAO) {
    const submissionId = uuidv4();

    await QuizSubmission.create({
      ...payload,
      id: submissionId,
    });

    const submission = await QuizSubmissionService.getOne(
      submissionId,
      payload.quiz_id,
      payload.user_id
    );
    return {
      ...submission,
      id: submissionId,
    };
  }

  static async count(quizId: string, userId: string) {
    const allSubmision = await QuizSubmission.count({
      where: {
        quiz_id: quizId,
        user_id: userId,
      },
    });

    return allSubmision;
  }
}
