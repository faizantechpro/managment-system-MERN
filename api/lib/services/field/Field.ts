import { Sequelize } from 'sequelize';
import { Literal } from 'sequelize/types/lib/utils';

import {
  ExtendFieldModel,
  FieldModel,
  FieldModifyAttributes,
  FieldResourceType,
} from 'lib/database/models/field';
import { Pagination } from 'lib/types';
import { PaginationResponse } from '../utils/Base';
import { ResourceTypeAssociation } from '../utils/ResourceTypeAssociation';

export type ExtendedFieldResponse<T extends FieldResourceType> = {
  [L in `total_${T}s`]: number;
};

export abstract class Field<
  T extends FieldResourceType,
  U extends FieldModel<T> = FieldModel<T>,
  V extends ExtendedFieldResponse<T> = ExtendedFieldResponse<T>
> extends ResourceTypeAssociation<T, U> {
  /**
   * Returns the correct literal to be used in `attributes` to find the
   * association count corresponding to the model.
   */
  getCountAttributes() {
    const count: [Literal, string] =
      this.resourceType === 'contact'
        ? [
            Sequelize.literal(`(
            select count(cf.id) from contact_field cf where field.id = cf.field_id
          )`),
            'total_contacts',
          ]
        : [
            Sequelize.literal(`(
            select count(of.id) from organization_field of where field.id = of.field_id
          )`),
            'total_organizations',
          ];
    return {
      attributes: {
        include: [count],
      },
    };
  }

  parseCountAttributes(row: any): ExtendFieldModel<T, V> {
    if (this.resourceType === 'contact') {
      row.dataValues.total_contacts = Number(row.dataValues.total_contacts);
    } else {
      row.dataValues.total_organizations = Number(
        row.dataValues.total_organizations
      );
    }

    return row as ExtendFieldModel<T, V>;
  }

  async get(pagination: Pagination): Promise<PaginationResponse<U, V>> {
    const { limit, page } = pagination;

    const { count, rows } = await this.model.findAndCountAll({
      where: {
        type: this.resourceType,
      },
      limit,
      offset: limit * (page - 1),
      order: [['order', 'ASC']],
      ...this.getCountAttributes(),
    });

    const extRows = rows.map(this.parseCountAttributes.bind(this));

    return this.getPaginatedResponse(extRows as any, count, pagination);
  }

  async getOne(id: string) {
    const field = await this.model.findOne({
      where: {
        id,
        type: this.resourceType,
      },
      ...this.getCountAttributes(),
    });

    if (!field) {
      return null;
    }

    const extField = this.parseCountAttributes(field);

    return extField.toJSON();
  }

  /**
   * Fields are unique by key and type
   */
  async getOneByKey(key: string) {
    const field = await this.model.findOne({
      where: {
        key,
        type: this.resourceType,
      },
      ...this.getCountAttributes(),
    });

    if (!field) {
      return null;
    }

    const extField = this.parseCountAttributes(field);
    return extField.toJSON();
  }

  async upsert(payload: FieldModifyAttributes<T>) {
    payload.created_by = this.user.id;
    payload.type = this.resourceType;
    payload.tenant_id = this.user.tenant;

    // Upon field retrieval, we parse currents values to the type they were
    // stored in. Thus we must prevent field updating types from "string" to
    // "number", for example, if there are any fields currently using it.
    const existingField = await this.getOneByKey(payload.key);
    if (
      existingField &&
      existingField.field_type !== payload.field_type &&
      ((existingField as any).total_contacts > 0 ||
        (existingField as any).total_organizations > 0)
    ) {
      return Promise.reject({
        status: 400,
        error: 'Unable to update field type when its in use',
      });
    }

    const [field] = await this.model.upsert(payload, {
      returning: true,
    });

    await this.feedLog.create({
      tenant_id: this.user.tenant,
      type: 'field',
      summary: 'Field added',
      object_data: payload,
      created_by: this.user.id,
    });

    return field.toJSON();
  }

  async remove(id: string) {
    await this.model.destroy({
      where: {
        id,
        type: this.resourceType,
      },
      limit: 1,
    });

    return;
  }
}
