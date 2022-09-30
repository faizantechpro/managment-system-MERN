import { ContextQuery, Pagination } from 'lib/dao';
import { GetCoursesQuery } from 'lib/middlewares/sequelize';
import { Biz } from './utils';
import { UserQuery } from './utils/ContextQuery';

export class CourseBiz extends Biz {
  async getSelfContext(
    override: UserQuery | undefined,
    query: GetCoursesQuery
  ) {
    const tenantContext = await this.userQuery.build({
      ...override,
      // if we're filtering child associations, don't restrict parent to self
      self: query.favorites || query.progress ? false : override?.self,
    });

    const context: ContextQuery<'CourseDB'> = tenantContext;

    // favorites is either favorites for self or courses that have been favorited
    if (query.favorites || query.progress) {
      const userContext = await this.userQuery.build(override);
      context.progress = userContext;
    }

    return context;
  }

  async get(
    override: UserQuery | undefined,
    pagination: Pagination,
    query: GetCoursesQuery
  ) {
    const context = await this.getSelfContext(override, query);

    return this.services.dao.course.find(context, pagination, query);
  }
}
