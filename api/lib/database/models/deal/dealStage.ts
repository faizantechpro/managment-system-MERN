import { defaultModelOptions, StaticModel } from 'lib/database/helpers';
import { DealStageAttrs } from 'lib/middlewares/sequelize';
import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export type DealStageAttributes = DealStageAttrs;
export type DealStageModifyAttributes = Optional<DealStageAttributes, 'id'>;
export type DealStageModel = Model<
  DealStageAttributes,
  DealStageModifyAttributes
>;
type DealStageStatic = StaticModel<DealStageModel>;

export function DealStageRepository(sqlz: Sequelize) {
  return sqlz.define(
    'deal_stage',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deleted_on: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
    },
    {
      tableName: 'deal_stage',
      ...defaultModelOptions,
    }
  ) as DealStageStatic;
}
