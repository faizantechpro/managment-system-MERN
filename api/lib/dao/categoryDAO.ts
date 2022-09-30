import { Op, TransactionOptions } from 'sequelize';
import {
  CategoryCreateDAO,
  CategoryModifyDAO,
  CategoryQueryDAO,
} from 'lib/middlewares/sequelize';
import { ContextQuery, Pagination } from './utils';
import DAO from './utils/DAO';
import Where, { WhereOptions } from './utils/Where';

export class CategoryDAO extends DAO<'CategoryDB'> {
  async find(
    context: ContextQuery,
    pagination: Pagination,
    query: CategoryQueryDAO
  ) {
    const {
      extraData = [],
      order = ['position', 'asc'],
      search,
      status,
      ...rest
    } = query;

    const builder = this.where();
    builder.merge({ ...rest });
    if (search) {
      builder.iLike(search, 'title');
    }
    if (status) {
      builder.merge({ status });
    }
    // TODO revisit this because... really?
    if (extraData.length) {
      builder.merge({
        id: {
          [Op.notIn]: extraData,
        },
      });
    }

    this.includePublicResults(builder);
    builder.context(context);
    this.setImplicitPublic(builder);

    const { count, rows } = await this.repo.findAndCountAll({
      attributes: {
        include: [
          builder.buildPublicImplicit(),
          ...this.getTrainingCount(context),
        ],
      },
      order: [order],
      where: builder.build(),
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(
      this.rowsToJSON<{
        isPublic: boolean;
        totalCourses: number;
        totalLessons: number;
      }>(rows),
      count,
      pagination
    );
  }

  async findOneById(context: ContextQuery, id: number) {
    const builder = this.where();
    builder.merge({ id });
    this.includePublicResults(builder, { category_id: id });
    builder.context(context);
    this.setImplicitPublic(builder);

    const category = await this.repo.findOne({
      attributes: {
        include: [
          builder.buildPublicImplicit(),
          ...this.getTrainingCount(context),
        ],
      },
      where: builder.build(),
    });

    return this.toJSON<{
      isPublic: boolean;
      totalCourses: number;
      totalLessons: number;
    }>(category);
  }

  async create(payload: CategoryCreateDAO) {
    const category = await this.repo.create({
      ...payload,
    });

    return this.toJSON(category)!;
  }

  async updateById(
    context: ContextQuery,
    id: number,
    payload: CategoryModifyDAO
  ) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    const [, [category]] = await this.repo.update(payload, {
      returning: true,
      where: builder.build(),
    });

    return this.toJSON(category);
  }

  async deleteById(
    context: ContextQuery,
    id: number,
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    await this.repo.destroy({
      where: builder.build(),
      ...opts,
    });
  }

  private includePublicResults(
    builder: Where<'CategoryDB'>,
    query: WhereOptions<'CourseDB' | 'LessonDB'> = {}
  ) {
    const publicQuery = {
      ...query,
      isPublic: true,
      status: 'published',
    };

    builder.publicIn<'LessonDB'>('id', 'lessons', 'category_id', publicQuery);
    builder.publicIn<'CourseDB'>('id', 'courses', 'category_id', publicQuery);
  }

  // TODO need to investigate this for counts
  // TODO need to investigate ordering as well....
  // if (favorites === 'true') {
  //   lessonInclude.push({
  //     association: 'progress',
  //     where: {
  //       is_favorited: 1,
  //     },
  //     required: true,
  //   });
  //   courseInclude.push({
  //     association: 'progress',
  //     where: {
  //       is_favorite: true,
  //     },
  //     required: true,
  //   });
  // }

  /**
   * Constructs the implicit attribute for public categories
   */
  private setImplicitPublic(builder: Where<'CategoryDB'>) {
    builder.publicImplicit<'CourseDB'>(
      'CategoryDB',
      'id',
      'courses',
      'category_id',
      {
        deleted: false,
        isPublic: true,
      }
    );
    builder.publicImplicit<'LessonDB'>(
      'CategoryDB',
      'id',
      'lessons',
      'category_id',
      {
        isPublic: true,
        status: { [Op.ne]: 'deleted' },
      }
    );
  }
  private getTrainingCount(context: ContextQuery) {
    const courseBuilder = this.services.dao.course.where();
    courseBuilder.merge({
      deleted: false,
      is_learning_path: false,
    });
    courseBuilder.context(context);

    const lessonBuilder = this.services.dao.lesson.where();
    lessonBuilder.merge({
      status: { [Op.ne]: 'deleted' },
    });
    lessonBuilder.context(context);

    return [
      courseBuilder.buildCountQuery<'CategoryDB'>(
        'CategoryDB',
        'id',
        'courses',
        'category_id',
        {
          isPublic: true,
          status: 'published',
        },
        'totalCourses'
      ),
      lessonBuilder.buildCountQuery<'CategoryDB'>(
        'CategoryDB',
        'id',
        'lessons',
        'category_id',
        {
          isPublic: true,
          status: 'published',
        },
        'totalLessons'
      ),
    ];
  }
}
