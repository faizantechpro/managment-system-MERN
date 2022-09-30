import { PickNotUndefined } from 'lib/utils';
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
  ToCreateType,
  ToModifyType,
} from '../types';
import { TenantDB } from './TenantDB';

export type GroupAttrs = {
  /**
   * @format uuid
   */
  id: string;
  /**
   * @format uuid
   */
  parent_id?: string | null; // self reference to parent group
  name: string;
  has_sibling_access: boolean;
  description?: string | null;
  tenant_id: string;
  deleted_on?: Date | null;
};

export type GroupAttr = GroupAttrs & ModelTimestamp;

export type GroupCreateDAO = ToCreateType<
  GroupAttr,
  'deleted_on',
  'id',
  'has_sibling_access'
>;
export type GroupModifyDAO = ToModifyType<GroupCreateDAO, 'tenant_id'>;

export type GroupCreateBiz = {
  /**
   * There can only be 1 root group per tenant. A root group is defined as a
   * group with a "null" parent_id.
   *
   * @format uuid
   */
  parent_id?: string | null;
  /**
   * @maxLength 50
   */
  name: string;
  has_sibling_access?: boolean;
  description?: string | null;
};
// todo due to security issues, prevent updating parent_id
export type GroupModifyBiz = Partial<Omit<GroupCreateBiz, 'parent_id'>>;

@Table({
  ...defaultModelOptions,
  tableName: 'groups',
})
export class GroupDB extends Model<
  GroupAttr,
  PickNotUndefined<GroupCreateDAO>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: GroupAttr['id'];

  @ForeignKey(() => GroupDB)
  @Column(DataType.UUID)
  parent_id!: GroupAttr['parent_id'];
  @BelongsTo(() => GroupDB, 'parent_id')
  parent!: GroupDB;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  name!: GroupAttr['name'];

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  has_sibling_access!: GroupAttr['has_sibling_access'];

  @Column(DataType.TEXT)
  description!: GroupAttr['description'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: GroupAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;

  @Column(DataType.DATE)
  deleted_on!: GroupAttr['deleted_on'];
}
