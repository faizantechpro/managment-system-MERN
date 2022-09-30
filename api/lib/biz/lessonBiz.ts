import { ContextQuery } from 'lib/dao';
import { GetLessonsQuery } from 'lib/middlewares/sequelize';
import { Pagination } from 'lib/types';
import { Biz } from './utils';
import { UserQuery } from './utils/ContextQuery';

export class LessonBiz extends Biz {
  async getSelfContext(
    override: UserQuery | undefined,
    query: GetLessonsQuery
  ) {
    const tenantContext = await this.userQuery.build({
      ...override,
      // if we're filtering child associations, don't restrict parent to self
      self: query.favorites || query.progress ? false : override?.self,
    });

    const context: ContextQuery<'LessonDB'> = tenantContext;

    // favorites is either favorites for self or lessons that have been favorited
    if (query.favorites || query.progress) {
      const userContext = await this.userQuery.build(override);
      context.progress = userContext;
    }

    return context;
  }

  async get(
    override: UserQuery | undefined,
    pagination: Pagination,
    query: GetLessonsQuery
  ) {
    const context = await this.getSelfContext(override, query);

    // TODO is this really needed.........??????
    if (this.user.auth.isAdmin && !query.status) {
      query.status = ["eq 'published'", "eq 'draft'"];
    }

    return this.services.dao.lesson.find(context, pagination, query);
  }
}
