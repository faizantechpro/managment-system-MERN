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
import { AnalyticCreateBiz, AnalyticDB } from './AnalyticDB';
import { TenantDB } from './TenantDB';
import { UserDB } from './UserDB';
import { DashboardComponentDB } from './DashboardComponentDB';
import { DashboardDB } from '.';
import { PickNotUndefined } from 'lib/utils';

export type ComponentAttr = {
  /**
   * @format uuid
   */
  id: string;
  name: string;

  // allow null in db to keep component flexible
  /**
   * @format uuid
   */
  analyticId: string;

  /**
   * @format uuid
   */
  createdById?: string | null;
  /**
   * @format uuid
   */
  tenantId?: string | null;
} & Timestamp;

export type ComponentCreateDAO = ToCreateType<
  ComponentAttr,
  never,
  'id',
  never
>;
export type ComponentModifyDAO = ToModifyType<
  ComponentCreateDAO,
  'createdById' | 'tenantId'
>;

export type ComponentCreateBiz = Omit<
  ComponentCreateDAO,
  'createdById' | 'tenantId'
>;
export type ComponentModifyBiz = {
  name?: string;
  analyticId?: string;
};
export type ComponentCreateWithAnalyticBiz =
  | { component: ComponentCreateBiz }
  | {
      analytic: AnalyticCreateBiz;
      // TODO fix this in schema
      component: Omit<ComponentCreateBiz, 'analyticId'>;
    };

@Table({
  ...camelModelOptions,
  tableName: 'component',
})
export class ComponentDB extends Model<
  ComponentAttr,
  PickNotUndefined<ComponentCreateDAO>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: ComponentAttr['id'];

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: ComponentAttr['name'];

  @ForeignKey(() => AnalyticDB)
  @Column(DataType.UUID)
  analyticId!: ComponentAttr['analyticId'];
  @BelongsTo(() => AnalyticDB, 'analyticId')
  analytic!: AnalyticDB;

  @ForeignKey(() => UserDB)
  @Column(DataType.UUID)
  createdById!: ComponentAttr['createdById'];
  @BelongsTo(() => UserDB, 'createdById')
  createdBy!: UserDB;

  @ForeignKey(() => TenantDB)
  @Column(DataType.UUID)
  tenantId!: ComponentAttr['tenantId'];
  @BelongsTo(() => TenantDB, 'tenantId')
  tenant!: TenantDB;

  @HasMany(() => DashboardComponentDB, 'componentId')
  dashboardComponents!: DashboardComponentDB[];

  @BelongsToMany(() => DashboardDB, () => DashboardComponentDB, 'dashboardId')
  dashboards!: (DashboardDB & { dashboardComponent: DashboardComponentDB })[];
}
