import { Model, DataTypes, Sequelize } from 'sequelize';
import { defaultModelOptions, StaticModel } from '../../helpers';

export type DealFollowersAttributes = {
  user_id: string;
  deal_id: string;
};

export type DealFollowersModel = Model<DealFollowersAttributes>;

type DealFollowerStatic = StaticModel<DealFollowersModel>;

export function DealFollowersRepository(sqlz: Sequelize) {
  return <DealFollowerStatic>sqlz.define(
    'deals_followers',
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
      tableName: 'deals_followers',
      ...defaultModelOptions,
      timestamps: false,
    }
  );
}
