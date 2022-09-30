import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import {
  defaultModelOptions,
  ModelTimestamps,
  StaticModel,
} from 'lib/database/helpers';

export type ReportInsightType =
  | 'DEFAULT' // the default report view
  | 'RPMG_ACH'
  | 'RPMG_CHECK'
  | 'RPMG_CREDIT_CARD'
  | 'RPMG_WIRE_TRANSFER';

type ReportInsightAttributes = {
  id: string;
  report_id: string;
  created_by: string;
  type: ReportInsightType;
  hidden: boolean;
  position: number;
};

export type ReportInsightCreateAttributes = Optional<
  ReportInsightAttributes,
  'id' | 'created_by'
>;

export type ReportInsightUpdateAttributes = Omit<
  ReportInsightAttributes,
  'id' | 'created_by' | 'report_id'
>;

export type ReportInsightModel = Model<
  ReportInsightAttributes & ModelTimestamps,
  ReportInsightCreateAttributes | ReportInsightUpdateAttributes
>;

type ReportInsightStatic = StaticModel<ReportInsightModel>;

export function ReportInsightRepository(sqlz: Sequelize) {
  return sqlz.define(
    'report_insight',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      report_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(
          'DEFAULT',
          'RPMG_ACH',
          'RPMG_CHECK',
          'RPMG_CREDIT_CARD',
          'RPMG_WIRE_TRANSFER'
        ),
        allowNull: false,
      },
      hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'report_insight',
      ...defaultModelOptions,
    }
  ) as ReportInsightStatic;
}
