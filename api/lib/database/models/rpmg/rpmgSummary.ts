import { DataTypes, Model, Sequelize } from 'sequelize';
import { defaultModelOptions, StaticModel } from 'lib/database/helpers';

/**
 * Float was selected for currency datatype as all inserts are being manually
 * added.
 * Other option was to use a whole value representing cents.
 */
type RPMGSummaryAttributes = {
  id: string;
  rpmg_vertical_id: string;
  average_p_card_spending: number; // floating currency
  average_p_card_transactions: number;
  average_spending_per_transaction: number; // floating currency
  average_spending_per_mm_revenue: number; // floating currency
};

type RPMGSummaryModel = Model<RPMGSummaryAttributes>;

type RPMGSummaryStatic = StaticModel<RPMGSummaryModel>;

export function RPMGSummaryRepository(sqlz: Sequelize) {
  return sqlz.define(
    'rpmg_summary',
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
      average_p_card_spending: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
      average_p_card_transactions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      average_spending_per_transaction: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
      average_spending_per_mm_revenue: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      tableName: 'rpmg_summary',
      ...defaultModelOptions,
    }
  ) as RPMGSummaryStatic;
}
