import { ContactModifyDAO } from 'lib/middlewares/sequelize';
import { ContextQuery } from './utils';
import DAO from './utils/DAO';

export class ContactDAO extends DAO<'ContactDB'> {
  async updateById(
    context: ContextQuery,
    id: string | string[],
    payload: ContactModifyDAO
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
