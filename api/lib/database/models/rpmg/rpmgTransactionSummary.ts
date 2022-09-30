import { DataTypes, Model, Sequelize } from 'sequelize';
import { defaultModelOptions, StaticModel } from 'lib/database/helpers';

type RPMGTransactionSummaryAttributes = {
  id: string;
  rpmg_vertical_id: string;
  rpmg_transaction_id: string;

  // the following represent are numbers representing a percentage
  all_card_platforms: number;
  checks: number;
  ach: number;
  wire_transfer: number;
};

export type RPMGTransactionSummaryModel =
  Model<RPMGTransactionSummaryAttributes>;

type RPMGTransactionSummaryStatic = StaticModel<RPMGTransactionSummaryModel>;

export function RPMGTransactionSummaryRepository(sqlz: Sequelize) {
  return sqlz.define(
    'rpmg_transaction_summary',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      rpmg_vertical_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      rpmg_transaction_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      all_card_platforms: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
      checks: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
      ach: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
      wire_transfer: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      tableName: 'rpmg_transaction_summary',
      ...defaultModelOptions,
    }
  ) as RPMGTransactionSummaryStatic;
}
