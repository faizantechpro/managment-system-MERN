import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import {
  defaultModelOptions,
  ModelTimestamps,
  StaticModel,
} from '../../helpers';

/**
 * All currency number values are represented as a tenth of a cent.
 * This eliminates the need to work with floats and may make conversion easier
 *
 * e.g.: 1 = 0.001 usd = 0.1 cent
 * e.g.: $1.23 will be represented as 1230 (tenths of a cent)
 */

export type ReportType = 'TREASURY';

export type TreasuryService = {
  id: number; // typically index, allows mapping from output
  name: string;
  total_items: number;
  item_fee: number; // currency
  proposed_item_fee: number; // currency
};

export type TreasuryInput = {
  type: 'TREASURY';
  client_name: string;
  proposed_bank_name: string;
  date: string; // ISO date string
  average_balance: number; // currency
  services: TreasuryService[];
  logo_white: string;
  logo_dark: string;
};
export type ReportInput = TreasuryInput;

export type ReportAttributes = {
  id: string;
  organization_id: string;
  created_by: string;
  file_id: string;
  type: ReportType;
  input: ReportInput; // input for report output generation
  month: string; // | `${YYYY}${MM}`; TODO investigate how to dynamically create enum on openapi
  tenant_id: string;
};
export type ReportCreateAttributes = Optional<
  ReportAttributes,
  'id' | 'file_id' | 'created_by'
>;

export type ReportUpdateAttributes = Omit<
  ReportAttributes,
  'id' | 'created_by'
>;

export type ReportModel = Model<
  ReportAttributes & ModelTimestamps,
  ReportCreateAttributes | ReportUpdateAttributes
>;

type ReportStatic = StaticModel<ReportModel>;

export function ReportRepository(sqlz: Sequelize) {
  return <ReportStatic>sqlz.define(
    'report',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      organization_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      file_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM('TREASURY'),
        allowNull: false,
      },
      month: {
        type: DataTypes.STRING,
      },
      input: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: 'report',
      ...defaultModelOptions,
    }
  );
}
