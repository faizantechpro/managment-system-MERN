import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { defaultModelOptions } from '../types';
import { RoleDB } from './RoleDB';
import { TenantDB } from './TenantDB';

export type PermissionAttr = {
  id: number;
  /**
   * @format uuid
   */
  role?: string | null;
  /**
   * @maxLength 64
   */
  collection: string;
  /**
   * @maxLength 10
   */
  action: string;
  permissions?: any; // TODO define this json type
  validation?: any; // TODO define this json type
  presets?: any; // TODO define this json type
  fields?: string;
  limit?: number;
  /**
   * @format uuid
   */
  tenant_id: string;
};

@Table({
  ...defaultModelOptions,
  tableName: 'permissions',
  timestamps: false,
})
export class PermissionDB extends Model<PermissionAttr> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: PermissionAttr['id'];

  @ForeignKey(() => RoleDB)
  @Column(DataType.UUID)
  role!: PermissionAttr['role'];

  @Column(DataType.STRING(64))
  collection!: PermissionAttr['collection'];

  @Column(DataType.STRING(10))
  action!: PermissionAttr['action'];

  @Column(DataType.JSON)
  permissions!: PermissionAttr['permissions'];

  @Column(DataType.JSON)
  validation!: PermissionAttr['validation'];

  @Column(DataType.JSON)
  presets!: PermissionAttr['presets'];

  @Column(DataType.TEXT)
  fields!: PermissionAttr['fields'];

  @Column(DataType.INTEGER)
  limit!: PermissionAttr['limit'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: PermissionAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;
}
