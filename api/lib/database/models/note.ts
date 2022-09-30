import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { defaultModelOptions, StaticModel } from '../helpers';

export type NoteAttributes = {
  id: string;
  assigned_user_id: string;
  modified_user_id: string;
  created_by: string;
  name?: string;
  contact_id?: string;
  organization_id?: string;
  description?: string;
  note?: object;
  deleted?: boolean;
  deal_id?: string;
  tenant_id?: string;
};

export type NoteModifyAttributes = Optional<NoteAttributes, 'id'>;

export type NoteModel = Model<NoteAttributes, NoteModifyAttributes>;

type NoteStatic = StaticModel<NoteModel>;

export function NoteRepository(sqlz: Sequelize) {
  return sqlz.define(
    'note',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      assigned_user_id: { type: DataTypes.UUID, allowNull: false },
      modified_user_id: { type: DataTypes.UUID, allowNull: false },
      created_by: { type: DataTypes.UUID, allowNull: false },
      name: DataTypes.STRING,
      contact_id: { type: DataTypes.UUID, allowNull: true },
      organization_id: { type: DataTypes.UUID, allowNull: true },
      description: DataTypes.TEXT,
      note: { type: DataTypes.JSON, allowNull: true },
      deleted: DataTypes.BOOLEAN,
      deal_id: { type: DataTypes.UUID, allowNull: true },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: 'note',
      ...defaultModelOptions,
      underscored: true,
      timestamps: true,
    }
  ) as NoteStatic;
}
