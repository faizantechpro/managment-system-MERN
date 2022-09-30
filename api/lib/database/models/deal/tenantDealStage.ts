import { defaultModelOptions, StaticModel } from 'lib/database/helpers';
import { TenantDealStageAttrs } from 'lib/middlewares/sequelize';
import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export type TenantDealStageAttributes = TenantDealStageAttrs;
export type TenantDealStageModifyAttributes = Optional<
  TenantDealStageAttributes,
  'id'
>;
export type TenantDealStageModel = Model<
  TenantDealStageAttributes,
  TenantDealStageModifyAttributes
>;
type TenantDealStageStatic = StaticModel<TenantDealStageModel>;

export function TenantDealStageRepository(sqlz: Sequelize) {
  return sqlz.define(
    'tenant_deal_stage',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      position: {
        type: DataTypes.INTEGER,
      },
      probability: {
        type: DataTypes.FLOAT,
      },
    },
    {
      tableName: 'tenant_deal_stage',
      ...defaultModelOptions,
    }
  ) as TenantDealStageStatic;
}
