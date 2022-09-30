import { v4 as uuidv4 } from 'uuid';
import { Op, WhereOptions } from 'sequelize';

import { Quiz, Question } from '../database';
import { QuizAttributes } from '../database/models/quiz';
import { Pagination } from '../types/items';
import { UserContext } from 'lib/middlewares/openapi';
import { AuthorizationService } from './authorization';
import { InvalidPayload } from 'lib/middlewares/exception';

export class QuizService {
  static async getQuizzes(
    { limit = 10, page = 1, search, order, action, ...filters }: Pagination,
    user: UserContext
  ) {
    const where: WhereOptions = { deleted: false, ...filters };

    if (action === 'manage') {
      AuthorizationService.isAdmin(user);
      if (!user.admin) {
        where.tenant_id = user.tenant;
      }
    }

    if (search) {
      where.intro = { [Op.iLike]: `%${search}%` };
    }

    const data = await Quiz.findAndCountAll({
      where,
      limit,
      offset: limit * (page - 1),
      order: [order || ['updated_at', 'DESC']],
    });

    return {
      data: data.rows,
      pagination: {
        limit: Number(limit),
        page: Number(page),
        totalPages: Math.ceil(data.count / limit),
        count: data.count,
      },
    };
  }

  static async getQuiz(id: string) {
    return await Quiz.findByPk(id, {
      include: ['pages'],
      order: [['pages', 'order', 'ASC']],
    });
  }

  static async deleteQuiz(id: string) {
    const foundQuiz = await Quiz.findByPk(id);
    if (!foundQuiz) {
      throw new InvalidPayload('Quiz not found');
    }

    await Quiz.update({ deleted: true }, { where: { id } });
    return id;
  }

  static async createUpdateLesson({
    tenant_id,
    id,
    intro,
    description,
    status,
    minimum_score,
    max_attempts,
  }: QuizAttributes) {
    const data = { intro, description, minimum_score, max_attempts };

    if (id) {
      return await Quiz.update(
        { ...data, status: status },
        { where: { id, tenant_id: tenant_id } }
      );
    }

    return await Quiz.create({
      ...data,
      status: 'draft',
      id: uuidv4(),
      tenant_id,
    });
  }

  static async createUpdatePages({ pages, removePages = [] }: any, user: any) {
    if (removePages?.length) {
      await Question.destroy({ where: { id: removePages } });
    }
    const pagesWithTenant = pages.map((page: any) => ({
      ...page,
      tenant_id: user.tenant,
    }));

    return await Question.bulkCreate(pagesWithTenant, {
      updateOnDuplicate: ['title', 'content', 'qoption', 'order'],
    }).catch((err) => console.log(err));
  }
}
