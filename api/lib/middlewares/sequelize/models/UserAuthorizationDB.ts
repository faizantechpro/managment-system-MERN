import { PickNotUndefined } from 'lib/utils';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { camelModelOptions, ToCreateType, ToModifyType } from '../types';
import { GroupDB } from './GroupDB';
import { RoleDB } from './RoleDB';
import { UserDB } from './UserDB';

export type UserAuthorizationAttr = {
  /**
   * @format uuid
   */
  userId: string;

  /**
   * @format uuid
   */
  roleId?: string | null; // no role means very restricted access

  /**
   * @format uuid
   */
  groupId?: string | null; // no group means only access data that belongs to user
};

export type UserAuthorizationCreateDAO = ToCreateType<
  UserAuthorizationAttr,
  never,
  never,
  never
>;
export type UserAuthorizationModifyDAO = ToModifyType<
  UserAuthorizationCreateDAO,
  'userId'
>;

export type UserAuthorizationModifyBiz = {
  /**
   * @format uuid
   */
  roleId?: string | null;
  /**
   * @format uuid
   */
  groupId?: string | null;
};

@Table({
  ...camelModelOptions,
  tableName: 'userAuthorization',
})
export class UserAuthorizationDB extends Model<
  UserAuthorizationAttr,
  PickNotUndefined<UserAuthorizationCreateDAO>
> {
  @PrimaryKey
  @ForeignKey(() => UserDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  userId!: UserAuthorizationAttr['userId'];
  @BelongsTo(() => UserDB, 'userId')
  user!: UserDB;

  @ForeignKey(() => RoleDB)
  @Column(DataType.UUID)
  roleId!: UserAuthorizationAttr['roleId'];
  @BelongsTo(() => RoleDB, 'roleId')
  role!: RoleDB;

  @ForeignKey(() => GroupDB)
  @Column(DataType.UUID)
  groupId!: UserAuthorizationAttr['groupId'];
  @BelongsTo(() => GroupDB, 'groupId')
  group!: GroupDB;
}
