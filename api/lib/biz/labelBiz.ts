import { LabelAttr, LabelType } from 'lib/middlewares/sequelize';
import { OptionalNullable } from 'lib/utils';
import { Biz } from './utils';
import { UserQuery } from './utils/ContextQuery';

// TODO may need to switch to Biz layer instead of DAO (for contact + organization)
export class LabelBiz extends Biz {
  async getAllByType(override: UserQuery | undefined, type: LabelType) {
    const context = await this.userQuery.build(override);

    return this.services.dao.label.findAllByType(context, type);
  }

  async getOneById(override: UserQuery | undefined, id: string) {
    const context = await this.userQuery.build(override);

    const label = await this.services.dao.label.findOneById(context, id);

    if (!label) {
      throw new this.exception.ResourceNotFound('label');
    }
    return label;
  }

  async create(
    override: UserQuery | undefined,
    payload: OptionalNullable<Pick<LabelAttr, 'color' | 'name' | 'type'>>
  ) {
    const context = await this.tenantQuery.build(override);

    // TODO possibly a bug? only looking by name without tenant id
    const existingLabel = await this.services.dao.label.findOneByName(
      {},
      payload.name
    );
    if (existingLabel) {
      throw new this.exception.Conflict('label already exists');
    }

    return this.services.dao.label.create({
      ...payload,
      tenant_id: context.tenantId,
      // TODO possibly a bug for owners?
      assigned_user_id: this.user.auth.isAdmin ? undefined : this.user.id,
    });
  }

  async updateById(
    override: UserQuery | undefined,
    id: string,
    payload: Partial<Pick<LabelAttr, 'color' | 'name' | 'type'>>
  ) {
    const context = await this.userQuery.build(override);

    await this.getOneById(override, id);

    // TODO possible bug for owner??? needs to be tenant wide?
    const totalUpdated = await this.services.dao.label.updateById(
      {
        tenantId: context.tenantId,
        userId: this.user.auth.isAdmin ? undefined : this.user.id,
      },
      id,
      payload
    );
    if (!totalUpdated) {
      throw new this.exception.Forbidden('Unauthorized to update label');
    }

    return;
  }

  async deleteById(override: UserQuery | undefined, id: string) {
    const context = await this.userQuery.build(override);

    const label = await this.services.dao.label.findOneByIdWithAssociations(
      context,
      id
    );
    if (!label) {
      throw new this.exception.ResourceNotFound('label');
    }

    // Not kept in DAO as it's business logic to set label_id to null rather than
    // do something like a cascade delete.
    const promises = [];
    if (label.contacts.length > 0) {
      promises.push(
        this.services.dao.contact.updateById(
          context,
          label.contacts.map(({ id }) => id),
          { label_id: null }
        )
      );
    }
    if (label.organizations.length > 0) {
      promises.push(
        this.services.dao.organization.updateById(
          context,
          label.organizations.map(({ id }) => id),
          { label_id: null }
        )
      );
    }
    await Promise.all(promises);

    await this.services.dao.label.deleteById(context, id);

    return;
  }
}
