import { StaticModel } from 'lib/database/helpers';
import {
  ContactFieldModel,
  ContactFieldModifyAttribute,
} from 'lib/database/models/contactsField';
import {
  OrganizationFieldModel,
  OrganizationFieldModifyAttribute,
} from 'lib/database/models/organizationsField';
import { UserContext } from 'lib/middlewares/openapi';
import { Pagination } from 'lib/types';
import {
  ContactsFieldService,
  OrganizationsFieldService,
  fieldFactory,
} from '../field';
import {
  ResourceKey,
  ResourceKeyAssociation,
} from '../utils/ResourceKeyAssociation';

export type FieldByResourceModel<T extends Exclude<ResourceKey, 'deal_id'>> = {
  contact_id: ContactFieldModel;
  organization_id: OrganizationFieldModel;
}[T];

type FieldByResourceModifyModel<T extends Exclude<ResourceKey, 'deal_id'>> = {
  contact_id: ContactFieldModifyAttribute;
  organization_id: OrganizationFieldModifyAttribute;
}[T];

export class FieldByResource<
  T extends Exclude<Extract<keyof U['_attributes'], ResourceKey>, 'deal_id'>,
  U extends FieldByResourceModel<T> = FieldByResourceModel<T>,
  V extends StaticModel<U> = StaticModel<U>
> extends ResourceKeyAssociation<T, U> {
  protected field: ContactsFieldService | OrganizationsFieldService;

  constructor(model: V, user: UserContext, resourceKey: T) {
    super(model, user, resourceKey);

    if (resourceKey === 'contact_id') {
      this.field = fieldFactory(user, 'contact');
    } else {
      this.field = fieldFactory(user, 'organization');
    }
  }

  async getFields(resourceId: string, pagination: Pagination, opts?: any) {
    const { page = 1, limit = 10 } = pagination;

    const { rows, count } = await this.model.findAndCountAll({
      where: {
        [this.resourceKey]: resourceId,
        tenant_id: this.user.tenant,
        ...opts,
      },
      limit,
      offset: limit * (page - 1),
      include: [
        {
          association: 'field',
          // TODO consider a better way to do this to avoid cyclic import loop
          ...this.field.getCountAttributes(),
        },
      ],
    });
    const extRows = rows.map((row: any) => {
      row.field = this.field.parseCountAttributes(row.field);
      return row;
    });

    return this.getPaginatedResponse(extRows, count, pagination);
  }

  async getOne(id: string, resourceId: string) {
    const field = await this.model.findOne({
      where: {
        id,
        [this.resourceKey]: resourceId,
      },
      include: [
        {
          association: 'field',
          // TODO consider a better way to do this to avoid cyclic import loop
          ...this.field.getCountAttributes(),
        },
      ],
    });

    if (!field) {
      return null;
    }
    (field as any).field = this.field.parseCountAttributes(
      (field as any).field
    );

    return field.toJSON();
  }

  async upsert(resourceId: string, payload: FieldByResourceModifyModel<T>) {
    payload.created_by = this.user.id;
    payload.tenant_id = this.user.tenant;

    const [field] = await this.model.upsert(
      {
        ...payload,
        [this.resourceKey]: resourceId,
      },
      {
        returning: true,
      }
    );

    return field.toJSON();
  }

  async remove(id: string, resourceId: string) {
    await this.model.destroy({
      where: {
        id,
        [this.resourceKey]: resourceId,
      },
      limit: 1,
    });

    return;
  }
}
