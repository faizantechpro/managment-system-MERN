import { Pagination } from 'lib/dao';
import { UserQueryBiz } from 'lib/middlewares/sequelize';
import { Biz } from './utils';
import { UserQuery } from './utils/ContextQuery';

export class UserBiz extends Biz {
  async get(
    override: UserQuery | undefined,
    pagination: Pagination,
    query: UserQueryBiz
  ) {
    const context = await this.userQuery.build(override);

    return this.services.dao.user.find(context, pagination, query);
  }
}
