import {
  LabelCreateDAO,
  LabelDB,
  LabelModifyDAO,
  LabelType,
} from 'lib/middlewares/sequelize';
import { ContextQuery } from './utils';
import DAO from './utils/DAO';

export class LabelDAO extends DAO<'LabelDB'> {
  // TODO check if `null` or is really needed...
  async findAllByType(context: ContextQuery, type: LabelType) {
    const builder = this.where();
    builder.or([{ type: null }, { type }]);
    builder.context(context);

    const rows = await this.repo.findAll({
      where: builder.build(),
      order: [['created_at', 'ASC']],
    });

    return this.rowsToJSON(rows);
  }

  async findOneById(context: ContextQuery, id: string) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    const label = await this.repo.findOne({
      where: builder.build(),
    });

    return this.toJSON(label);
  }

  async findOneByIdWithAssociations(context: ContextQuery, id: string) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    const label = await this.repo.findOne({
      where: builder.build(),
      include: ['organizations', 'contacts'],
    });

    const parsedLabel = this.toJSON(label);
    if (!parsedLabel) {
      return;
    }

    return {
      ...parsedLabel,
      contacts: this.genericRowsToJSON(
        label?.get('contacts') as LabelDB['contacts']
      ),
      organizations: this.genericRowsToJSON(
        label?.get('organizations') as LabelDB['organizations']
      ),
    };
  }

  async findOneByName(context: ContextQuery, name: string) {
    const builder = this.where();
    builder.merge({ name });
    builder.context(context);

    const label = await this.repo.findOne({
      where: builder.build(),
    });

    return this.toJSON(label);
  }

  async create(payload: LabelCreateDAO) {
    const label = await this.repo.create(payload);

    return this.toJSON(label)!;
  }

  async updateById(context: ContextQuery, id: string, payload: LabelModifyDAO) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    const [totalUpdated] = await this.repo.update(payload, {
      where: builder.build(),
    });

    return totalUpdated;
  }

  async deleteById(context: ContextQuery, id: string) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    await this.repo.destroy({
      where: builder.build(),
    });
  }
}
