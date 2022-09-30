import { PickNotUndefined } from 'lib/utils';
import {
  AllowNull,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { defaultModelOptions, ModelTimestamp, ToCreateType } from '../types';
import { NaicsSpDB } from './NaicsSpDB';

const spSummaryAggregationTypes = ['AVERAGE'] as const;
export type SpSummaryAggregationType = typeof spSummaryAggregationTypes[number];

export type SpSummaryAttr = {
  /**
   * @format uuid
   */
  id: string;
  // indicates the type of aggregation performed across all NAICS codes
  aggregation_type?: SpSummaryAggregationType | null;

  // iso date string of report date
  report_date: Date;

  // rounded to whole number
  days_sales_out?: number | null;
  days_payable_out?: number | null;
  working_capital?: number | null;
  working_capital_ratio?: number | null;
} & ModelTimestamp;

export type SpSummaryCreateDAO = ToCreateType<
  SpSummaryAttr,
  never,
  'id',
  'report_date'
>;

@Table({
  ...defaultModelOptions,
  tableName: 'sp_summary',
})
export class SpSummaryDB extends Model<
  SpSummaryAttr,
  PickNotUndefined<SpSummaryCreateDAO>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: SpSummaryAttr['id'];

  @HasMany(() => NaicsSpDB, 'sp_summary_id')
  naics_sp!: NaicsSpDB[];

  @Column(DataType.ENUM(...spSummaryAggregationTypes))
  aggregation_type!: SpSummaryAttr['aggregation_type'];

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  report_date!: SpSummaryAttr['report_date'];

  @Column(DataType.FLOAT)
  days_sales_out!: SpSummaryAttr['days_sales_out'];

  @Column(DataType.FLOAT)
  days_payable_out!: SpSummaryAttr['days_payable_out'];

  @Column(DataType.FLOAT)
  working_capital!: SpSummaryAttr['working_capital'];

  @Column(DataType.FLOAT)
  working_capital_ratio!: SpSummaryAttr['working_capital_ratio'];
}
