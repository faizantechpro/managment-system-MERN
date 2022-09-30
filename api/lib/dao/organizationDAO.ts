import { OrganizationModifyDAO } from 'lib/middlewares/sequelize';
import { ContextQuery } from './utils';
import DAO from './utils/DAO';

export class OrganizationDAO extends DAO<'OrganizationDB'> {
  async updateById(
    context: ContextQuery,
    id: string | string[],
    payload: OrganizationModifyDAO
  ) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    await this.repo.update(payload, {
      where: builder.build(),
      returning: true,
    });

    return;
  }
}
