import {
  BadgeAttr,
  CategoryAttr,
  CourseProgressAttr,
  CourseQueryDAO,
  QuizAttr,
} from 'lib/middlewares/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Cast } from 'sequelize/types/lib/utils';
import { ContextQuery, Pagination } from './utils';
import DAO from './utils/DAO';
import Where, { WhereOptions } from './utils/Where';

export class CourseDAO extends DAO<'CourseDB'> {
  /**
   * This function is a bit overloaded and covers the following
   *
   * 1. Get all courses
   * 2. Get all courses created by self
   * 3. Only get all courses that have been favorited by any user
   * 4. Only get all courses that have been favorited by self
   */
  async find<T extends {} = { totalLessons: number }>(
    context: ContextQuery<'CourseDB'>,
    pagination: Pagination,
    query: CourseQueryDAO
  ) {
    const {
      categoryId,
      favorites,
      order = [['updated_at', 'desc']],
      progress,
      search,
      status,
      totalLessons = true,
    } = query;
    let { include = ['badge'] } = query;

    const categoryBuilder = this.services.dao.category.where();
    const builder = this.where();

    builder.merge({ deleted: false, is_learning_path: false });

    if (categoryId) {
      builder.merge({ category_id: categoryId });
    }
    if (search) {
      builder.iLike(search, 'name');
      categoryBuilder.iLike(search, 'title');
    }
    if (status) {
      builder.merge({ status });
    }

    if (favorites || progress) {
      include = include.filter((table) => table !== 'progress');

      const progressBuilder = this.services.dao.courseProgress.where();

      if (favorites) {
        progressBuilder.merge({ is_favorite: true });
      }
      progressBuilder.context(context.progress || context);

      include.push({
        association: 'progress',
        // if we're looking for progress, we want to include all courses
        required: !!(!progress || favorites),
        where: progressBuilder.build(),
      });
    }

    this.includePublicResults(builder);
    builder.context(context);

    const { count, rows } = await this.repo.findAndCountAll({
      attributes: {
        include: totalLessons ? [this.getLessonsCount()] : [],
      },
      distinct: favorites || progress,
      include,
      // this is required for child ordering to work...
      subQuery: false,
      order: this.buildOrder(order),
      where: builder.build(),
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(
      this.rowsToJSON<
        T & {
          badge?: BadgeAttr;
          category?: CategoryAttr;
          progress?: CourseProgressAttr[];
          quiz?: QuizAttr;
        }
      >(rows),
      count,
      pagination
    );
  }

  async findByCategoryId(
    context: ContextQuery<'CourseDB'>,
    categoryId: number,
    pagination: Pagination,
    query: CourseQueryDAO
  ) {
    return this.find<{}>(context, pagination, {
      ...query,
      categoryId,
      include: ['badge'],
      status: "eq 'published'",
      totalLessons: false,
    });
  }

  private getLessonsCount() {
    return [
      // reaching the limit of Sequelize... must count with literal for 1:M..
      // without this raw query, sequelize improperly does a group by..
      Sequelize.cast(
        Sequelize.literal(`(
                SELECT COUNT(*) FROM "courses_lessons" cl WHERE "cl"."course_id" = "CourseDB"."id"
              )`),
        'integer'
      ),
      'totalLessons',
    ] as [Cast, string];
  }

  private includePublicResults(
    builder: Where<'CourseDB'>,
    query: WhereOptions<'CourseDB'> = {}
  ) {
    const publicQuery = {
      ...query,
      isPublic: true,
      status: 'published',
    };

    builder.publicWhere(publicQuery);
  }
}
