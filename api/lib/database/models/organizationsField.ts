import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { defaultModelOptions, ModelTimestamps, StaticModel } from '../helpers';

export type OrganizationFieldAttributes = {
  id: string;
  organization_id: string;
  field_id: string;
  created_by: string;

  // store as separate columns to avoid dealing with type checking
  value_char?: string;
  value_text?: string;
  value_number?: number;
  value_boolean?: boolean;
  value_date?: Date;

  // tenant
  tenant_id?: string;
};

export type OrganizationFieldModifyAttribute = Optional<
  OrganizationFieldAttributes,
  'id' | 'organization_id' | 'created_by'
>;

export type OrganizationFieldModel = Model<
  OrganizationFieldAttributes & ModelTimestamps,
  OrganizationFieldModifyAttribute
>;

type OrganizationFieldStatic = StaticModel<OrganizationFieldModel>;

export function OrganizationFieldRepository(sqlz: Sequelize) {
  return <OrganizationFieldStatic>sqlz.define(
    'organization_field',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      organization_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: 'unique_organization_id_field_id',
      },
      field_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: 'unique_organization_id_field_id',
        onDelete: 'CASCADE',
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      value_char: {
        type: DataTypes.CHAR,
      },
      value_text: {
        type: DataTypes.TEXT,
      },
      value_number: {
        type: DataTypes.INTEGER,
      },
      value_boolean: {
        type: DataTypes.BOOLEAN,
      },
      value_date: {
        type: DataTypes.DATE,
      },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: 'organization_field',
      ...defaultModelOptions,
      indexes: [
        {
          name: 'unique_organization_id_field_id',
          unique: true,
          type: 'UNIQUE',
          fields: [{ name: 'organization_id' }, { name: 'field_id' }],
        },
      ],
    }
  );
}
