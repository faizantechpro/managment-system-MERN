import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  AllowNull,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { defaultModelOptions, Order } from '../types';
import { TenantDB } from './TenantDB';

export type RoleAttr = {
  /**
   * @format uuid
   */
  id: string;
  /**
   * @format uuid
   */
  tenant_id: string;
  /**
   * @maxLength 100
   */
  name: string;
  icon?: string;
  description?: string;
  ip_access?: string;
  enforce_tfa: boolean;
  module_list?: any;
  collection_list?: any;
  admin_access: boolean;
  owner_access: boolean;
  app_access?: boolean;
};

export type RoleQueryDAO = {
  order?: Order;
};
export type RoleCreateDAO = Omit<RoleAttr, 'id'>;
export type RoleModifyDAO = Partial<Omit<RoleCreateDAO, 'tenant_id'>>;

export type RoleQueryBiz = RoleQueryDAO;
export type RoleCreateBiz = {
  /**
   * @maxLength 100
   */
  name: string;
  description?: string;
};
export type RoleModifyBiz = {
  /**
   * @maxLength 100
   */
  name?: string;
  description?: string;
  admin_access?: boolean;
  owner_access?: boolean;
};

@Table({
  ...defaultModelOptions,
  tableName: 'roles',
  timestamps: false,
})
export class RoleDB extends Model<RoleAttr> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: RoleAttr['id'];

  @ForeignKey(() => TenantDB)
  @Column(DataType.UUID)
  tenant_id!: RoleAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;

  @Column(DataType.STRING(100))
  name!: RoleAttr['name'];

  @AllowNull(false)
  @Default('supervised_user_circle')
  @Column(DataType.STRING(30))
  icon!: RoleAttr['icon'];

  @Column(DataType.TEXT)
  description!: RoleAttr['description'];

  @Column(DataType.TEXT)
  ip_access!: RoleAttr['ip_access'];

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  enforce_tfa!: RoleAttr['enforce_tfa'];

  @Column(DataType.JSON)
  module_list!: RoleAttr['module_list'];

  @Column(DataType.JSON)
  collection_list!: RoleAttr['collection_list'];

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  admin_access!: RoleAttr['admin_access'];

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  owner_access!: RoleAttr['owner_access'];

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  app_access!: RoleAttr['app_access'];
}
