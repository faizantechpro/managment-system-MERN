import {
  CategoryAttr,
  LessonProgressAttr,
  LessonQueryDAO,
} from 'lib/middlewares/sequelize';
import { ContextQuery, Pagination } from './utils';
import DAO from './utils/DAO';
import Where, { WhereOptions } from './utils/Where';

export class LessonDAO extends DAO<'LessonDB'> {
  /**
   * This function is a bit overloaded and covers the following
   *
   * 1. Get all lessons
   * 2. Get all lessons created by self
   * 3. Only get all lessons that have been favorited by any user
   * 4. Only get all lessons that have been favorited by self
   */
  async find(
    context: ContextQuery<'LessonDB'>,
    pagination: Pagination,
    query: LessonQueryDAO
  ) {
    const {
      categoryId,
      favorites,
      order = [['updated_at', 'desc']],
      progress,
      search,
      status,
    } = query;
    let { include = [] } = query;

    const categoryBuilder = this.services.dao.category.where();
    const builder = this.where();

    builder.merge({
      status: 'published',
    });

    if (categoryId) {
      builder.merge({ category_id: categoryId });
    }
    if (search) {
      builder.iLike(search, 'title');
      // TODO this doesn't work as include does id=category.id AND title ilike..
      categoryBuilder.iLike(search, 'title');
    }
    if (status) {
      builder.merge({ status });
    }

    if (favorites || progress) {
      include = include.filter((table) => table !== 'progress');

      const progressBuilder = this.services.dao.lessonProgress.where();

      if (favorites) {
        progressBuilder.merge({ is_favorited: 1 });
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

    include.push({
      association: 'category',
      required: false,
      where: categoryBuilder.build(),
    });

    const { count, rows } = await this.repo.findAndCountAll({
      distinct: favorites || progress,
      include,
      order: this.buildOrder(order),
      // this is required for child ordering to work...
      subQuery: false,
      where: builder.build(),
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(
      this.rowsToJSON<{
        progress?: LessonProgressAttr[];
        category?: CategoryAttr;
      }>(rows),
      count,
      pagination
    );
  }

  async findByCategoryId(
    context: ContextQuery<'LessonDB'>,
    categoryId: number,
    pagination: Pagination,
    query: LessonQueryDAO
  ) {
    return this.find(context, pagination, {
      ...query,
      categoryId,
      include: ['progress'],
    });
  }

  private includePublicResults(
    builder: Where<'LessonDB'>,
    query: WhereOptions<'LessonDB'> = {}
  ) {
    const publicQuery = {
      ...query,
      isPublic: true,
      status: 'published',
    };

    builder.publicWhere(publicQuery);
  }
}
