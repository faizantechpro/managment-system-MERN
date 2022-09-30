import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import {
  defaultModelOptions,
  ModelTimestamp,
  Order,
  Search,
  ToCreateType,
  ToModifyType,
} from '../types';
import { TenantDB } from './TenantDB';
import { PickNotUndefined } from 'lib/utils';

export type BadgeAttr = {
  /**
   * @format uuid
   */
  id: string;
  /**
   * @format uuid
   */
  tenant_id: string;
  name?: string | null;
  description?: string | null;
  status?: string | null;
  badge_url?: string | null;
  deleted: boolean;
} & ModelTimestamp;

export type BadgeQueryDAO = {
  search?: Search;
  order?: Order;
};
export type BadgeCreateDAO = ToCreateType<BadgeAttr, 'deleted', 'id', never>;
export type BadgeModifyDAO = ToModifyType<BadgeCreateDAO, 'tenant_id'>;

export type BadgeQueryBiz = {
  search?: Search;
  // order?: [string, 'asc' | 'desc'];
  // TODO for now because FE may not be typed....
  order?: any;
};
export type BadgeModifyBiz = Omit<BadgeCreateDAO, 'tenant_id'>;

@Table({
  ...defaultModelOptions,
  tableName: 'badges',
})
export class BadgeDB extends Model<
  BadgeAttr,
  PickNotUndefined<BadgeCreateDAO>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: BadgeAttr['id'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: BadgeAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;

  @Column(DataType.STRING)
  name!: BadgeAttr['name'];

  @Column(DataType.STRING)
  description!: BadgeAttr['description'];

  @Column(DataType.STRING)
  status!: BadgeAttr['status'];

  @Column(DataType.STRING)
  badge_url!: BadgeAttr['badge_url'];

  @Default(false)
  @Column(DataType.BOOLEAN)
  deleted!: BadgeAttr['deleted'];
}
