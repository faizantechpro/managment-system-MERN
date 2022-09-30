import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
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
import { TenantDB } from './TenantDB';
import { UserDB } from './UserDB';
import {
  ComponentCreateWithAnalyticBiz,
  ComponentDB,
  ComponentModifyBiz,
} from './ComponentDB';
import { DashboardComponentDB } from './DashboardComponentDB';
import { PickNotUndefined } from 'lib/utils';

export type DashboardAttr = {
  /**
   * @format uuid
   */
  id: string;
  name: string;

  /**
   * @format uuid
   */
  createdById: string;
  /**
   * @format uuid
   */
  tenantId: string;
} & Timestamp;

export type DashboardCreateDAO = ToCreateType<
  DashboardAttr,
  never,
  'id',
  never
>;
export type DashboardModifyDAO = ToModifyType<
  DashboardCreateDAO,
  'createdById' | 'tenantId'
>;

export type DashboardCreateBiz = Omit<
  DashboardCreateDAO,
  'tenantId' | 'createdById'
>;
export type DashboardModifyBiz = { name?: string };
export type DashboardAddComponentBiz = {} & ComponentCreateWithAnalyticBiz;
export type DashboardModifyComponentBiz = {} & {
  component?: ComponentModifyBiz;
};

@Table({
  ...camelModelOptions,
  tableName: 'dashboard',
})
export class DashboardDB extends Model<
  DashboardAttr,
  PickNotUndefined<DashboardCreateDAO>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: DashboardAttr['id'];

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: DashboardAttr['name'];

  @AllowNull(false)
  @ForeignKey(() => UserDB)
  @Column(DataType.UUID)
  createdById!: DashboardAttr['createdById'];
  @BelongsTo(() => UserDB, 'createdById')
  createdBy!: UserDB;

  @AllowNull(false)
  @ForeignKey(() => TenantDB)
  @Column(DataType.UUID)
  tenantId!: DashboardAttr['tenantId'];
  @BelongsTo(() => TenantDB, 'tenantId')
  tenant!: TenantDB;

  @HasMany(() => DashboardComponentDB, 'dashboardId')
  dashboardComponents!: DashboardComponentDB[];

  @BelongsToMany(() => ComponentDB, () => DashboardComponentDB, 'dashboardId')
  components!: (ComponentDB & { dashboardComponent: DashboardComponentDB })[];
}
