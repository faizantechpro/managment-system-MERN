import { BadgeAttr } from 'lib/middlewares/sequelize';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { StaticModel } from '../helpers';

export type BadgeAttributes = BadgeAttr;

export type BadgeModifyAttributes = Optional<BadgeAttributes, 'id'>;

export type BadgeModel = Model<BadgeAttributes, BadgeModifyAttributes>;

type BadgeStatic = StaticModel<BadgeModel>;

export function BadgeRepository(sqlz: Sequelize) {
  return <BadgeStatic>sqlz.define(
    'badges',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.STRING,
      badge_url: DataTypes.STRING,
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: 'badges',
      timestamps: true,
      underscored: true,
    }
  );
}
