import { UserAuthorizationModifyDAO } from 'lib/middlewares/sequelize';
import { TransactionOptions } from 'sequelize';
import { ContextQuery } from './utils';
import DAO from './utils/DAO';

export class UserAuthorizationDAO extends DAO<'UserAuthorizationDB'> {
  async findOneByUserId(
    context: ContextQuery,
    userId: string,
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ userId });

    const userAuthorization = await this.repo.findOne({
      where: builder.build(),
      ...opts,
    });

    return this.toJSON(userAuthorization);
  }

  async updateByGroupId(
    context: ContextQuery,
    groupId: string,
    payload: UserAuthorizationModifyDAO,
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ groupId });

    await this.repo.update(payload, {
      where: builder.build(),
      ...opts,
    });
  }

  async upsert(
    context: ContextQuery,
    userId: string,
    payload: UserAuthorizationModifyDAO,
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ userId });

    const [userAuthorization] = await this.repo.upsert(
      {
        ...payload,
        userId,
      },
      opts
    );

    return this.toJSON(userAuthorization)!;
  }
}
