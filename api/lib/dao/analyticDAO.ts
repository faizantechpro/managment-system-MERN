import {
  AnalyticCreateDAO,
  AnalyticModifyDAO,
  AnalyticType,
} from 'lib/middlewares/sequelize';
import { Op, TransactionOptions } from 'sequelize';
import { ContextQuery } from './utils';
import DAO from './utils/DAO';

export class AnalyticDAO extends DAO<'AnalyticDB'> {
  async findAllPublic(query: { type?: AnalyticType }) {
    const builder = this.where();
    if (query.type) {
      builder.merge({ type: query.type });
    }
    builder.merge({
      tenantId: null,
      createdById: null,
    });

    const rows = await this.repo.findAll({
      where: builder.build(),
    });

    return this.rowsToJSON(rows);
  }

  async findOneById(context: ContextQuery, id: string) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);
    const analytic = await this.repo.findOne({
      where: {
        [Op.or]: [
          {
            ...builder.build(),
          },
          // public analytic
          {
            id,
            createdById: null,
            tenantId: null,
          },
        ],
      },
    });

    return this.toJSON(analytic);
  }

  async create(payload: AnalyticCreateDAO, opts: TransactionOptions = {}) {
    const analytic = await this.repo.create(payload, opts);

    return this.toJSON(analytic)!;
  }

  async updateById(
    context: ContextQuery,
    id: string,
    payload: AnalyticModifyDAO,
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ id });
    builder.merge({ createdById: { [Op.ne]: null } });
    builder.merge({ tenantId: { [Op.ne]: null } });
    builder.context(context);

    const [, [analytic]] = await this.repo.update(payload, {
      where: builder.build(),
      returning: true,
      ...opts,
    });

    return this.toJSON(analytic);
  }

  async deleteById(
    context: ContextQuery,
    id: string | string[],
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ id });
    builder.merge({ createdById: { [Op.ne]: null } });
    builder.merge({ tenantId: { [Op.ne]: null } });
    builder.context(context);

    await this.repo.destroy({
      where: builder.build(),
      ...opts,
    });
  }
}
