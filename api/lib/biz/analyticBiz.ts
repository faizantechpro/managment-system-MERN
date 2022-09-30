import { AnalyticModifyBiz, AnalyticType } from 'lib/middlewares/sequelize';
import { TransactionOptions } from 'sequelize';
import { Biz } from './utils';
import { UserQuery } from './utils/ContextQuery';

export class AnalyticBiz extends Biz {
  async getAllPublic(query: { type?: AnalyticType }) {
    return this.services.dao.analytic.findAllPublic(query);
  }

  async getOneById(override: UserQuery | undefined, id: string) {
    const context = await this.userQuery.build(override);

    const analytic = await this.services.dao.analytic.findOneById(context, id);
    if (!analytic) {
      throw new this.exception.ResourceNotFound('analytic');
    }
    return analytic;
  }

  async updateById(
    override: UserQuery | undefined,
    id: string,
    payload: AnalyticModifyBiz,
    opts: TransactionOptions = {}
  ) {
    const context = await this.userQuery.build(override);

    const analytic = await this.services.dao.analytic.updateById(
      context,
      id,
      payload,
      opts
    );
    if (!analytic) {
      throw new this.exception.ResourceNotFound('analytic');
    }

    return analytic;
  }
}
