import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { defaultModelOptions, ModelTimestamps, StaticModel } from '../helpers';

export type CommentsAttributes = {
  id: number;
  feed_id: string;
  user_id: string;
  message: string;
  comment?: object;
  deleted: boolean;
  tenant_id: string;

  // TODO investigate dropping these fields. duplicating through feed relationship
  contact_id?: string;
  organization_id?: string;
  deal_id?: string;
};

export type CommentModifyAttributes = Optional<
  CommentsAttributes,
  'id' | 'tenant_id' | 'user_id'
>;

export type CommentsModel = Model<
  CommentsAttributes & ModelTimestamps,
  CommentModifyAttributes
>;

type CommentStatic = StaticModel<CommentsModel>;

export function CommentsRepository(sqlz: Sequelize) {
  return sqlz.define(
    'comments',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      user_id: { type: DataTypes.UUID, allowNull: false },
      feed_id: { type: DataTypes.UUID, allowNull: false },
      message: { type: DataTypes.STRING, allowNull: false },
      comment: { type: DataTypes.JSON, allowNull: true },
      contact_id: { type: DataTypes.UUID, allowNull: true },
      organization_id: { type: DataTypes.UUID, allowNull: true },
      deal_id: { type: DataTypes.UUID, allowNull: true },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: 'comments',
      ...defaultModelOptions,
    }
  ) as CommentStatic;
}
