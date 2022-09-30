import {
  RoleCreateDAO,
  RoleModifyDAO,
  RoleQueryDAO,
} from 'lib/middlewares/sequelize';
import { Transaction, TransactionOptions } from 'sequelize';
import { v4 } from 'uuid';
import { ContextQuery, Pagination } from './utils';
import DAO from './utils/DAO';

export class RoleDAO extends DAO<'RoleDB'> {
  async find(
    context: ContextQuery,
    pagination: Pagination,
    query: RoleQueryDAO
  ) {
    const builder = this.where();
    builder.context(context);

    const { count, rows } = await this.repo.findAndCountAll({
      order: query.order ? [query.order] : undefined,
      where: builder.build(),
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(this.rowsToJSON(rows), count, pagination);
  }

  async findOneById(context: ContextQuery, id: string) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    const role = await this.repo.findOne({
      where: builder.build(),
    });

    return this.toJSON(role);
  }

  async create(payload: RoleCreateDAO) {
    const role = await this.repo.create({
      id: v4(),
      ...payload,
    });

    return this.toJSON(role)!;
  }

  async updateById(context: ContextQuery, id: string, payload: RoleModifyDAO) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    const [, [role]] = await this.repo.update(payload, {
      where: builder.build(),
      returning: true,
    });

    return this.toJSON(role);
  }

  async deleteById(
    context: ContextQuery,
    id: string,
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    await this.transaction(
      {
        ...opts,
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      },
      async (transaction) => {
        // TODO this should be a cascade delete...
        await this.services.dao.permission.deleteByRoleId({}, id, {
          transaction,
        });

        await this.repo.destroy({
          where: builder.build(),
          transaction,
        });

        return;
      }
    );

    return;
  }
}
