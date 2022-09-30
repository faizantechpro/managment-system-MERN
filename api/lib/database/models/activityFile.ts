import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { defaultModelOptions, StaticModel } from '../helpers';

export type ActivityFileAttributes = {
  id: string;
  contact_id: string;
  organization_id: string;
  deal_id: string;
  file_id: string;
  assigned_user_id: string;
  created_by: string;
  tenant_id?: string;
};

export type ActivityFileModifyAttributes = Optional<
  ActivityFileAttributes,
  'id' | 'tenant_id' | 'created_by'
>;

export type ActivityFileModel = Model<
  ActivityFileAttributes,
  ActivityFileModifyAttributes
>;

type ActivityFileStatic = StaticModel<ActivityFileModel>;

export function ActivityFileRepository(sqlz: Sequelize) {
  return sqlz.define(
    'activity_file',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      contact_id: { type: DataTypes.UUID, allowNull: true },
      organization_id: { type: DataTypes.UUID, allowNull: true },
      deal_id: { type: DataTypes.UUID, allowNull: true },
      file_id: { type: DataTypes.UUID, allowNull: false },
      assigned_user_id: { type: DataTypes.UUID, allowNull: false },
      created_by: { type: DataTypes.UUID, allowNull: false },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: 'activity_file',
      ...defaultModelOptions,
    }
  ) as ActivityFileStatic;
}
