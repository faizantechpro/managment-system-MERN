import {
  BadgeCreateDAO,
  BadgeModifyDAO,
  BadgeQueryDAO,
} from 'lib/middlewares/sequelize';
import { ContextQuery, Pagination } from './utils';
import DAO from './utils/DAO';
import { TransactionOptions } from 'sequelize';

export class BadgeDAO extends DAO<'BadgeDB'> {
  async find(
    context: ContextQuery,
    pagination: Pagination,
    query: BadgeQueryDAO
  ) {
    const { search, order = ['updated_at', 'desc'], ...filters } = query;

    const builder = this.where();
    builder.merge({ deleted: false });
    if (search) {
      builder.iLike(search, 'name');
    }
    builder.context(context);

    const { count, rows } = await this.repo.findAndCountAll({
      where: {
        ...filters, // TODO type this..
        ...builder.build(),
      },
      ...this.getPaginationQuery(pagination),
      order: [order],
    });

    return this.getPaginatedResponse(this.rowsToJSON(rows), count, pagination);
  }

  async findOneById(context: ContextQuery, id: string) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    const badge = await this.repo.findOne({
      where: builder.build(),
    });

    return this.toJSON(badge);
  }

  async create(payload: BadgeCreateDAO) {
    const badge = await this.repo.create(payload);

    return this.toJSON(badge)!;
  }

  async updateById(context: ContextQuery, id: string, payload: BadgeModifyDAO) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    const [, [badge]] = await this.repo.update(payload, {
      where: builder.build(),
      returning: true,
    });

    return this.toJSON(badge);
  }

  async deleteById(
    context: ContextQuery,
    id: string,
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
}
