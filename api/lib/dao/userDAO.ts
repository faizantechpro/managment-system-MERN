import { RoleAttr, TenantAttr, UserQueryDAO } from 'lib/middlewares/sequelize';
import { ContextQuery, Pagination } from './utils';
import DAO from './utils/DAO';

export class UserDAO extends DAO<'UserDB'> {
  async find(
    context: ContextQuery,
    pagination: Pagination,
    query: UserQueryDAO
  ) {
    const { order = ['last_access', 'desc'], search, status, roleId } = query;

    const builder = this.where();

    if (status) {
      builder.merge({ status: status });
    }
    if (search) {
      const [firstName, lastName] = search.split(' ');

      if (firstName && !lastName) {
        builder.iLike(firstName, 'first_name', 'last_name');
      } else if (firstName) {
        builder.iLike(firstName, 'first_name');
      }
      if (lastName) {
        builder.iLike(lastName, 'last_name');
      }
    }
    if (roleId) {
      builder.merge({ role: roleId });
    }
    builder.context(context);

    const { count, rows } = await this.repo.findAndCountAll({
      include: ['roleInfo', 'tenant'],
      order: [order],
      where: builder.build(),
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(
      this.rowsToJSON<{ tenant: TenantAttr; roleInfo?: RoleAttr }>(rows),
      count,
      pagination
    );
  }

  async findByRole(
    context: ContextQuery,
    roleId: string,
    pagination: Pagination
  ) {
    const builder = this.where();
    builder.merge({ role: roleId });
    builder.context(context);

    const { count, rows } = await this.repo.findAndCountAll({
      where: builder.build(),
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(this.rowsToJSON(rows), count, pagination);
  }

  async findOneById(context: ContextQuery, userId: string) {
    const builder = this.where();
    builder.merge({ id: userId });
    builder.context(context);

    const user = await this.repo.findOne({
      where: builder.build(),
    });

    return this.toJSON(user);
  }
}
