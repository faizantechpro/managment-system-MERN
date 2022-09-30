import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { defaultModelOptions, StaticModel } from '../helpers';

export type OrganizationGuestAttributes = {
  id: string;
  shared_by_user_id: string;
  organization_id: string;
  contact_id: string; // guest must be a contact for organization
  email: string; // contacts can have more than 1 email, need to specify which
  tenant_id: string;
};

export type OrganizationGuestModifyAttributes = Optional<
  OrganizationGuestAttributes,
  'id' | 'organization_id' | 'shared_by_user_id' | 'tenant_id'
>;

export type OrganizationGuestModel = Model<
  OrganizationGuestAttributes,
  OrganizationGuestModifyAttributes
>;

type OrganizationGuestStatic = StaticModel<OrganizationGuestModel>;

export function OrganizationGuestRepository(sqlz: Sequelize) {
  return sqlz.define(
    'organization_guest',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      shared_by_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      organization_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      contact_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: 'organization_guest',
      ...defaultModelOptions,
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
      ],
    }
  ) as OrganizationGuestStatic;
}
