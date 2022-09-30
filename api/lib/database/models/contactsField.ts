import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { defaultModelOptions, ModelTimestamps, StaticModel } from '../helpers';

export type ContactFieldAttributes = {
  id: string;
  contact_id: string;
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

export type ContactFieldModifyAttribute = Optional<
  ContactFieldAttributes,
  'id' | 'contact_id' | 'created_by'
>;

export type ContactFieldModel = Model<
  ContactFieldAttributes & ModelTimestamps,
  ContactFieldModifyAttribute
>;

type ContactFieldStatic = StaticModel<ContactFieldModel>;

export function ContactFieldRepository(sqlz: Sequelize) {
  return <ContactFieldStatic>sqlz.define(
    'Contact_field',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      contact_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: 'unique_contact_id_field_id',
      },
      field_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: 'unique_contact_id_field_id',
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
      tableName: 'contact_field',
      ...defaultModelOptions,
      indexes: [
        {
          name: 'unique_contact_id_field_id',
          unique: true,
          type: 'UNIQUE',
          fields: [{ name: 'contact_id' }, { name: 'field_id' }],
        },
      ],
    }
  );
}
