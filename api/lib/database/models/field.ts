import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import {
  defaultModelOptions,
  ExpandModel,
  ModelTimestamps,
  StaticModel,
} from '../helpers';

/**
 * Allows type discrimination at the service level
 */
export type FieldResourceType = 'organization' | 'contact';

export type FieldAttributes<T extends FieldResourceType> = {
  id: string;
  created_by: string;
  key: string;
  // refers to the friendly type used by user
  field_type: 'CHAR' | 'TEXT' | 'NUMBER' | 'DATE' | 'TIME';
  // refers to the type of the value
  value_type: 'number' | 'string' | 'boolean' | 'date' | 'object';
  // order in which field should appear
  order: number;
  // fields are grouped by these types
  type: T;

  tenant_id?: string;
};

export type FieldModifyAttributes<T extends FieldResourceType> = Optional<
  FieldAttributes<T>,
  'id' | 'created_by' | 'type'
>;

export type FieldModel<T extends FieldResourceType> = ExpandModel<
  Model<FieldAttributes<T> & ModelTimestamps, FieldModifyAttributes<T>>
>;

export type ExtendFieldModel<T extends FieldResourceType, U = {}> = ExpandModel<
  Model<FieldAttributes<T> & ModelTimestamps & U, FieldModifyAttributes<T>>
>;

export type FieldStatic<T extends FieldResourceType> = StaticModel<
  FieldModel<T>
>;

export function FieldRepository(sqlz: Sequelize) {
  return <FieldStatic<FieldResourceType>>sqlz.define(
    'field',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'unique_key_type',
      },
      field_type: {
        type: DataTypes.ENUM('CHAR', 'TEXT', 'NUMBER', 'DATE', 'TIME'),
        allowNull: false,
      },
      value_type: {
        type: DataTypes.ENUM('number', 'string', 'boolean', 'date', 'object'),
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      type: {
        type: DataTypes.ENUM('organization', 'contact'),
        allowNull: false,
        unique: 'unique_key_type',
      },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: 'field',
      ...defaultModelOptions,
      indexes: [
        {
          name: 'unique_key',
          unique: true,
          type: 'UNIQUE',
          fields: [{ name: 'key' }, { name: 'type' }],
        },
      ],
    }
  );
}
