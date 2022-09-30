import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  AllowNull,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { defaultModelOptions } from '../types';
import { UserDB } from './UserDB';

export type UserCredentialAttr = {
  /**
   * @format uuid
   */
  user_id: string;
  password?: string;
  tfa_secret?: string;
};

@Table({
  ...defaultModelOptions,
  tableName: 'user_credential',
  timestamps: false,
})
export class UserCredentialDB extends Model<UserCredentialAttr> {
  @PrimaryKey
  @ForeignKey(() => UserDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  user_id!: UserCredentialAttr['user_id'];
  @BelongsTo(() => UserDB, 'user_id')
  user!: UserDB;

  @Column(DataType.STRING)
  password!: UserCredentialAttr['password'];

  @Column(DataType.STRING)
  tfa_secret!: UserCredentialAttr['tfa_secret'];
}
