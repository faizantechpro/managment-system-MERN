import { DealOwnerAttr } from 'lib/middlewares/sequelize';
import { Model, DataTypes, Sequelize } from 'sequelize';
import { defaultModelOptions, StaticModel } from '../../helpers';

export type DealOwnersAttributes = DealOwnerAttr;

export type DealOwnersModel = Model<DealOwnersAttributes>;

type DealOwnerStatic = StaticModel<DealOwnersModel>;

export function DealOwnersRepository(sqlz: Sequelize) {
  return <DealOwnerStatic>sqlz.define(
    'deal_owners',
    {
      user_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
      deal_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: 'deal_owners',
      ...defaultModelOptions,
      timestamps: false,
    }
  );
}
