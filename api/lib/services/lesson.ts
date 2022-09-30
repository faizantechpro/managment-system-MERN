import { Op, WhereOptions, Sequelize, Model } from 'sequelize';

import {
  Lesson,
  LessonTracking,
  Category,
  LessonPage,
  sequelize,
  Course,
  CourseLesson,
} from '../database';
import { PrimaryKey } from '../types/items';
import { feedLogServiceFactory } from './feed';
import { LessonModel } from 'lib/database/models/lesson';
import { AuthUser } from 'lib/middlewares/auth';
import ContextQuery from './utils/ContextQuery';
import { LessonProgressCreateDAO } from 'lib/middlewares/sequelize';

interface ILessonProp {
  id?: string;
  title: string;
  content: string;
  categoryId: number;
  maxPoints: number;
  maxAttemps: number;
  duration: number;
  documents?: string;
  tags?: string;
  icon?: string;
  status?: string;
  tenant_id: string;
}

interface ICreateUpdatePageProps {
  pages: IPagesProp[];
  removePages: string[];
}

interface IPagesProp {
  id: number;
  title: string;
  lesson_id: number;
  content: string;
  type: string;
  qtype: string;
  qoption: '';
  order: number;
}
abstract class LessonService extends ContextQuery<LessonModel> {
  get lessonAttributes() {
    return [
      'id',
      'title',
      'content',
      'max_points',
      'max_attempts',
      'documents',
      'duration',
      'tags',
      'icon',
      'status',
    ];
  }

  async getLessonById(id: PrimaryKey) {
    const user = await Lesson.findByPk(id, {
      attributes: this.lessonAttributes,
      include: ['pages', 'category'],
      order: [['pages', 'order', 'ASC']],
    });

    return user;
  }

  async getOverallProgress(reqQuery: any, userId: PrimaryKey) {
    const { favorites } = reqQuery;
    const lessonWhere: WhereOptions = {
      status: 'published',
      ...this.getContextQuery(),
    };

    const courseWhere: WhereOptions = {
      status: 'published',
      is_learning_path: false,
      deleted: false,
      ...this.getContextQuery(),
    };

    const query: WhereOptions = {
      user_id: userId,
      tenant_id: this.user.tenant,
      status: {
        [Op.ne]: null,
      },
    };

    const courseInclude = [];
    const lessonInclude = [];
    if (favorites === 'true') {
      lessonInclude.push({
        association: 'progress',
        where: {
          is_favorited: 1,
        },
        required: true,
      });
      courseInclude.push({
        association: 'progress',
        where: {
          is_favorite: true,
        },
        required: true,
      });
    }

    if (this.user.admin) {
      lessonWhere.status = {
        [Op.or]: ['published', 'draft'],
      };
    }

    const lessons = await Lesson.count({
      include: lessonInclude,
      where: lessonWhere,
      distinct: true,
    });

    const courses = await Course.count({
      include: courseInclude,
      where: courseWhere,
      distinct: true,
    });

    const summary: Array<Model> = await LessonTracking.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('status')), 'lesson_count'],
        [Sequelize.fn('sum', Sequelize.col('points')), 'total_points'],
      ],
      group: ['status'],
      where: query,
    });

    const resp = {
      total_points: 0,
      pending: 0,
      completed: 0,
      total_lessons: lessons,
      total_courses: courses,
    };

    if (summary.length) {
      summary.map((s) => {
        if (s.getDataValue('status') === 'completed') {
          resp.completed = parseInt(s.getDataValue('lesson_count'));
          resp.total_points = parseInt(s.getDataValue('total_points'));
        } else if (s.getDataValue('status') == 'in_progress') {
          resp.pending = parseInt(s.getDataValue('lesson_count'));
        }
      });
    }

    return resp;
  }

  async getLessonsByCategory(search: string, admin: boolean, query: any) {
    const { category_id } = query;
    let where: any = {
      // TODO investigate public course id verification
      // ...this.getContextQuery(),
      category_id: category_id,
      status: {
        [Op.ne]: 'deleted',
      },
    };
    if (!admin) {
      where = {
        ...where,
        status: {
          ...where.status,
          [Op.not]: 'draft',
        },
      };
    }
    if (search) {
      where = {
        ...where,
        title: { [Op.iLike]: `%${search}%` },
      };
    }

    const lessons = await Lesson.findAll({
      include: 'category',
      where,
    });

    return lessons;
  }

  async getRelatedLessons() {
    const lessonCategoryIds = await Lesson.findAll({
      attributes: ['category_id'],
      where: {
        category_id: {
          [Op.not]: null,
        },
        status: 'published',
        title: {
          [Op.not]: '',
        },
      },
      group: ['category_id'],
    });
    const categoryIds = lessonCategoryIds
      .map((item) => item.category_id)
      .filter((categoryId) => !!categoryId);

    const categories = await Category.findAll({
      attributes: ['id', 'title', 'status'],
      where: {
        id: {
          [Op.in]: categoryIds,
        } as any, // TODO address this..
      },
      include: [
        {
          model: Lesson,
          required: true,
          attributes: ['id', 'title', 'icon', 'status'],
          order: sequelize.random(),
          limit: 1,
          as: 'lessons',
        },
      ],
      order: sequelize.random(),
      limit: 3,
    });

    return categories.map((item: any) => item.lessons[0]);
  }

  async trackFavorite(lessonId: PrimaryKey) {
    const lessonTrack: any = await LessonTracking.findOne({
      where: {
        lesson_id: lessonId,
        user_id: this.user.id,
        tenant_id: this.user.tenant,
      },
    });

    if (!lessonTrack) {
      const lesson = await Lesson.findByPk(lessonId, {
        attributes: this.lessonAttributes,
        include: ['pages', 'category'],
        order: [['pages', 'order', 'ASC']],
      });

      if (lesson) {
        const page = {
          id: lesson.pages?.length ? lesson.pages[0].id : null,
          isFirst: false,
          isLast: true,
          progress: 0,
          points: null,
        };

        const newTracking: LessonProgressCreateDAO = {
          user_id: this.user.id,
          lesson_id: lessonId as number,
          page_id: page.id as number,
          last_attempted_at: new Date(),
          status: 'pending',
          progress: Math.ceil(page.progress * 100),
          is_favorited: 1,
          tenant_id: this.user.tenant,
        };

        // bypass sequelize validation, wil be compatible with sequelize-typescript
        return await LessonTracking.create(newTracking as any);
      }
    }

    const isFavorite = Boolean(lessonTrack.is_favorited);

    return await LessonTracking.update(
      {
        is_favorited: isFavorite ? 0 : 1,
      },
      { where: { id: lessonTrack.id } }
    );
  }

  async track(lessonId: PrimaryKey) {
    return await LessonTracking.findOne({
      where: {
        lesson_id: lessonId,
        user_id: this.user.id,
      },
    });
  }

  /**
   * Provides tracking information for an array of lessons.
   */
  async trackBulk(lessonIds: number[]) {
    return await LessonTracking.findAll({
      where: {
        lesson_id: lessonIds,
        user_id: this.user.id,
        tenant_id: this.user.tenant,
      },
    });
  }

  async trackLesson(lessonId: PrimaryKey, page: any) {
    const feedLogService = feedLogServiceFactory(this.user);

    const lesson = await Lesson.findByPk(lessonId, {
      attributes: this.lessonAttributes,
      include: ['pages'],
    });

    if (!lesson) {
      return false;
    }

    // double check page id is valid
    const pageObj = lesson.pages?.find((page) => page.id === page.id);

    if (!pageObj) {
      return false;
    }

    const newTracking: LessonProgressCreateDAO = {
      user_id: this.user.id,
      lesson_id: lessonId as number,
      page_id: page.id as number,
      last_attempted_at: new Date(),
      status: 'in_progress',
      progress: Math.ceil(page.progress * 100),
      tenant_id: this.user.tenant,
    };

    if (page.isFirst) {
      newTracking.started_at = new Date();
    }

    if (page.isLast) {
      newTracking.completed_at = new Date();
      newTracking.status = 'completed';
    }

    if (page.points) {
      newTracking.points = page.points;
    }

    let track;
    const isTracked = await LessonTracking.findOne({
      where: {
        user_id: this.user.id,
        lesson_id: lessonId as number,
      },
    });

    if (!isTracked) {
      // bypass sequelize validation, wil be compatible with sequelize-typescript
      track = await LessonTracking.create(newTracking as any);
      await feedLogService.create({
        tenant_id: this.user.tenant,
        created_by: this.user.id,
        type: 'lessonStarted',
        summary: 'Started a Lesson',
        object_data: {
          id: lessonId,
          title: lesson.title,
          duration: lesson.duration,
        },
      });
    } else {
      // do not track completed lessons
      if (isTracked.getDataValue('completed_at') !== null) {
        await feedLogService.create({
          tenant_id: this.user.tenant,
          created_by: this.user.id,
          type: 'lessonCompleted',
          summary: 'Lesson completed',
          object_data: {
            id: lessonId,
            title: lesson.title,
            duration: lesson.duration,
          },
        });

        return isTracked;
      }

      track = await LessonTracking.update(newTracking, {
        where: { id: isTracked.getDataValue('id') },
      });
    }

    return track;
  }

  async createUpdateLesson(lesson: ILessonProp) {
    const {
      id,
      title,
      content,
      categoryId: category_id,
      maxPoints: max_points,
      maxAttemps: max_attempts,
      duration,
      documents,
      tags,
      icon,
      status,
    } = lesson || {};

    const data = {
      tenant_id: this.user.tenant,
      title,
      content,
      category_id,
      max_attempts,
      max_points,
      duration,
      documents,
      tags,
      icon,
      isPublic: false,
    };

    if (status === 'published' && this.user.auth.isAdmin) {
      data.isPublic = true;
    }

    if (id)
      return await Lesson.update(
        { ...data, status: status },
        {
          where: {
            id,
            tenant_id: this.user.tenant,
          },
        }
      );

    return await Lesson.create({ status: status || 'draft', ...data });
  }

  async createUpdatePages(props: ICreateUpdatePageProps) {
    const { pages, removePages = [] } = props;

    if (removePages?.length) {
      await LessonPage.destroy({
        where: {
          id: removePages,
          tenant_id: this.user.tenant,
        },
      });
    }

    const pagesto = pages.map(async (page: any) => {    
      var response = {};
      if (!Number.isInteger(page?.id)) delete page.id;
       var data = { ...page, tenant_id: this.user.tenant };

      if(page.id){
        response  = await LessonPage.update(data,{
          fields: ['title', 'content', 'qoption', 'order'],
          where:{id:page.id}
        })
      }else{
        response = await LessonPage.create(data)
      }
      return response;
     // return { ...page, tenant_id: this.user.tenant };
    });
    return pagesto;
     }

  async submitAnswer(
    userId: PrimaryKey,
    lessonId: PrimaryKey,
    pageId: PrimaryKey,
    answer: any
  ): Promise<boolean> {
    // @TODO query points from lesson
    const MAX_POINTS = 3;
    const page = await LessonPage.findOne({
      where: {
        id: pageId,
        lesson_id: lessonId,
        type: 'quiz',
      },
    });
    if (!page) {
      return false;
    }

    const answers = page.getDataValue('qoption') as any;
    if (answers.length === 0) {
      return false;
    }

    const correctAnwser = answers.filter((a: any) => a.correct);
    if (correctAnwser.length === 0) {
      return false;
    }

    const userTrack = await LessonTracking.findOne({
      where: {
        user_id: userId,
        lesson_id: lessonId,
      },
    });

    if (!userTrack) {
      return false;
    }

    // set attempts regardless of whether answer is correct or not
    const currentAttempts = userTrack.getDataValue('attempts') as number;
    userTrack.setDataValue('attempts', currentAttempts + 1);

    await userTrack.save();

    // user submitted answer is not correct
    if (correctAnwser[0].id != answer) {
      return false;
    } else {
      // user submitted answer is correct
      const points = MAX_POINTS - currentAttempts;
      userTrack.setDataValue('points', points > 0 ? points : 0);
      await userTrack.save();
      return true;
    }
  }

  async tracked(lessonId: PrimaryKey) {
    return await LessonTracking.findAll({
      where: {
        lesson_id: lessonId,
        tenant_id: this.user.tenant,
      },
    });
  }

  async deleteLesson(id: PrimaryKey) {
    await Lesson.update(
      {
        status: 'deleted',
      },
      {
        where: { id, tenant_id: this.user.tenant },
      }
    );

    return id;
  }

  async findByCourseIds(rows: Array<Model>) {
    return await Promise.all(
      rows.map(async (row: any) => {
        const courseLessons = await CourseLesson.findAll({
          where: { course_id: row.dataValues.id },
        });
        const lessonsId = courseLessons.map((lesson) => lesson.id);
        const fetchLessons = await Lesson.findAll({
          where: { id: { [Op.in]: lessonsId } },
        });
        const lessons = fetchLessons.map((lesson) => lesson.toJSON());
        return { ...row.toJSON(), lessons };
      })
    );
  }

  async findPagesByLessonIds(rows: Array<Model>) {
    return await Promise.all(
      rows.map(async (row: any) => {
        const pages = await LessonPage.findAll({
          where: { lesson_id: row.dataValues.id },
        });
        return { ...row.toJSON(), pages };
      })
    );
  }
}

export class AdminLessonService extends LessonService {
  getContextQuery() {
    return {};
  }
}
export class OwnerLessonService extends LessonService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export class UserLessonService extends LessonService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export function LessonServiceFactory(user: AuthUser) {
  if (user?.auth?.isAdmin) {
    return new AdminLessonService(Lesson, user);
  } else if (user?.auth?.isOwner) {
    return new OwnerLessonService(Lesson, user);
  }
  return new UserLessonService(Lesson, user);
}
