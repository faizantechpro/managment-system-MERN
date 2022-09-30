import { ActivityAttrs } from 'lib/middlewares/sequelize/models';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { defaultModelOptions, StaticModel } from '../helpers';

export type ActivitiesAttributes = ActivityAttrs;

export type ActivityModifyAttributes = Optional<ActivitiesAttributes, 'id'>;

export type ActivitiesModel = Model<
  ActivitiesAttributes,
  ActivityModifyAttributes
>;

type ActivityStatic = StaticModel<ActivitiesModel>;

export function ActivitiesRepository(sqlz: Sequelize) {
  return sqlz.define(
    'activities',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      assigned_user_id: { type: DataTypes.UUID, allowNull: false },
      modified_user_id: { type: DataTypes.UUID, allowNull: false },
      created_by: { type: DataTypes.UUID, allowNull: false },
      organization_id: { type: DataTypes.UUID },
      deal_id: { type: DataTypes.UUID },
      start_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      end_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      guests: { type: DataTypes.STRING, allowNull: false },
      location: { type: DataTypes.STRING, allowNull: false },
      conference_link: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      free_busy: { type: DataTypes.STRING, allowNull: false },
      notes: { type: DataTypes.STRING, allowNull: false },
      rich_note: { type: DataTypes.JSON },
      owner: { type: DataTypes.UUID, allowNull: false },
      lead: { type: DataTypes.STRING, allowNull: false },
      done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      feed_id: { type: DataTypes.UUID, allowNull: false },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
      deleted_on: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'activities',
      ...defaultModelOptions,
    }
  ) as ActivityStatic;
}
