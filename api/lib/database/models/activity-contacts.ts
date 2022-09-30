import { defaultModelOptions, StaticModel } from 'lib/database/helpers';
import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export type ActivityContactAttributes = {
  id: string;
  activity_id: string;
  contact_id: string;
};

export type ActivityContactModifyAttributes = Optional<
  ActivityContactAttributes,
  'id'
>;

export type ActivityContactModel = Model<
  ActivityContactAttributes,
  ActivityContactModifyAttributes
>;
type ActivityContactStatic = StaticModel<ActivityContactModel>;

export function ActivityContactRepository(sqlz: Sequelize) {
  return sqlz.define(
    'activity_contacts',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      activity_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      contact_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: 'activity_contacts',
      ...defaultModelOptions,
    }
  ) as ActivityContactStatic;
}
