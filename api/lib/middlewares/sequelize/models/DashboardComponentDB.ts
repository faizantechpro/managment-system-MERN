import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import {
  camelModelOptions,
  Timestamp,
  ToCreateType,
  ToModifyType,
} from '../types';
import { ComponentDB } from './ComponentDB';
import { DashboardDB } from './DashboardDB';
import { PickNotUndefined } from 'lib/utils';

export type DashboardComponentAttr = {
  /**
   * @format uuid
   */
  dashboardId: string;
  /**
   * @format uuid
   */
  componentId: string;
} & Timestamp;

export type DashboardComponentCreateDAO = ToCreateType<
  DashboardComponentAttr,
  never,
  never,
  never
>;
export type DashboardComponentModifyDAO = ToModifyType<
  DashboardComponentCreateDAO,
  'dashboardId' | 'componentId'
>;

@Table({
  ...camelModelOptions,
  tableName: 'dashboardComponent',
})
export class DashboardComponentDB extends Model<
  DashboardComponentAttr,
  PickNotUndefined<DashboardComponentCreateDAO>
> {
  @ForeignKey(() => DashboardDB)
  @PrimaryKey
  @Column(DataType.UUID)
  dashboardId!: string;
  @BelongsTo(() => DashboardDB, 'dashboardId')
  dashboard!: DashboardDB;

  @ForeignKey(() => ComponentDB)
  @PrimaryKey
  @Column(DataType.UUID)
  componentId!: string;
  @BelongsTo(() => ComponentDB, 'componentId')
  component!: ComponentDB;
}
