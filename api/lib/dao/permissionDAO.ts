import { TransactionOptions } from 'sequelize/types';
import { ContextQuery } from './utils';
import DAO from './utils/DAO';

export class PermissionDAO extends DAO<'PermissionDB'> {
  async deleteByRoleId(
    context: ContextQuery,
    roleId: string,
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ role: roleId });
    builder.context(context);

    await this.repo.destroy({
      where: builder.build(),
      ...opts,
    });

    return;
  }
}
