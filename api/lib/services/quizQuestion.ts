import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

import { Question } from '../database';

export class QuizQuestionService {
  /**
   * Retrieves all questions for a quiz. As questions are not expected to
   * exceed a large size, pagination is not used.
   */
  static async getAllByQuizId(quizId: string) {
    const questions = await Question.findAll({
      where: {
        quiz_id: quizId,
      },
    });

    return {
      data: questions,
    };
  }
}
