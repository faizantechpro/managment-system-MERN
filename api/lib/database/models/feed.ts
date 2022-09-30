import { FeedAttrs } from 'lib/middlewares/sequelize';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { defaultModelOptions, ModelTimestamps, StaticModel } from '../helpers';

export type FeedAttributes = FeedAttrs;

export type FeedModifyAttributes = Optional<FeedAttributes, 'id'>;

export type FeedModel = Model<
  FeedAttributes & ModelTimestamps,
  FeedModifyAttributes
>;

type FeedStatic = StaticModel<FeedModel>;

export function FeedRepository(sqlz: Sequelize) {
  return sqlz.define(
    'feed',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      summary: DataTypes.STRING,
      type: { type: DataTypes.STRING, allowNull: false },
      object_data: DataTypes.JSON,
      content: DataTypes.STRING,
      created_by: { type: DataTypes.UUID, allowNull: false },
      updated_by: { type: DataTypes.UUID },
      contact_id: { type: DataTypes.UUID },
      organization_id: { type: DataTypes.UUID },
      deal_id: { type: DataTypes.UUID },
      created_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: 'feed',
      ...defaultModelOptions,
    }
  ) as FeedStatic;
}
