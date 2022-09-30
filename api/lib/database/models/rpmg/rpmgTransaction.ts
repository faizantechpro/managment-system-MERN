import { DataTypes, Model, Sequelize } from 'sequelize';
import { defaultModelOptions, StaticModel } from 'lib/database/helpers';

type RPMGTransactionAttributes = {
  id: string;
  name: string;
  range: string; // denotes the monetary  range summary applies to, e.g. 0-2500
};

export type RPMGTransactionModel = Model<RPMGTransactionAttributes>;

type RPMGTransactionStatic = StaticModel<RPMGTransactionModel>;

export function RPMGTransactionRepository(sqlz: Sequelize) {
  return sqlz.define(
    'rpmg_transaction',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      range: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'rpmg_transaction',
      ...defaultModelOptions,
    }
  ) as RPMGTransactionStatic;
}
