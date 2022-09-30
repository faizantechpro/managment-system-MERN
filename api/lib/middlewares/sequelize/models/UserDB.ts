import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  Model,
  AllowNull,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { defaultModelOptions, Order, Search } from '../types';
import { RoleDB } from './RoleDB';
import { TenantDB } from './TenantDB';
import { UserAuthorizationDB } from './UserAuthorizationDB';
import { UserCredentialDB } from './UserCredentialDB';

export const userStatuses = [
  'active',
  'inactive',
  'suspended',
  'deleted',
] as const;
export type UserStatus = typeof userStatuses[number];

export type UserAttr = {
  /**
   * @format uuid
   */
  id: string;
  /**
   * @format uuid
   */
  tenant_id: string;
  first_name?: string;
  last_name?: string;
  email: string; // TODO make this not null in table
  location?: string;
  title?: string;
  description?: string;
  tags?: any;
  avatar?: string;
  status: string; // TODO define as enum and not null
  /**
   * @format uuid
   */
  role?: string; // TODO drop this
  last_access?: Date;
  last_page?: string;
  phone?: string;
};

export type UserQueryDAO = {
  search?: Search;
  order?: Order;
  status?: UserStatus;
  /**
   * @format uuid
   */
  roleId?: string; // TODO drop this
};

export type UserQueryBiz = {
  search?: Search;
  order?: Order;
  status?: UserStatus;
  /**
   * @format uuid
   */
  roleId?: string; // TODO drop this
};

@Table({
  ...defaultModelOptions,
  timestamps: false,
  tableName: 'users',
})
export class UserDB extends Model<UserAttr> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: UserAttr['id'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: UserAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;

  @Column(DataType.STRING)
  first_name!: UserAttr['first_name'];

  @Column(DataType.STRING)
  last_name!: UserAttr['last_name'];

  @Unique
  @Column(DataType.STRING)
  email!: UserAttr['email'];

  @Column(DataType.STRING)
  location!: UserAttr['location'];

  @Column(DataType.STRING)
  title!: UserAttr['title'];

  @Column(DataType.STRING)
  description!: UserAttr['description'];

  @Column(DataType.JSON)
  tags!: UserAttr['tags'];

  @Column(DataType.STRING)
  avatar!: UserAttr['avatar'];

  @Column(DataType.STRING)
  status!: UserAttr['status'];

  // TODO drop this column after releasing userauthorization db model
  @ForeignKey(() => RoleDB)
  @Column(DataType.UUID)
  role!: UserAttr[]; // TODO rename to role to role_id
  @BelongsTo(() => RoleDB, 'role')
  roleInfo!: TenantDB;

  @Column(DataType.DATE)
  last_access!: UserAttr['last_access'];

  @Column(DataType.STRING)
  last_page!: UserAttr['last_page'];

  @Column(DataType.STRING)
  phone!: UserAttr['phone'];

  @HasOne(() => UserCredentialDB, 'user_id')
  credential!: UserCredentialDB;

  @HasOne(() => UserAuthorizationDB, 'userId')
  authorization!: UserAuthorizationDB;
}
