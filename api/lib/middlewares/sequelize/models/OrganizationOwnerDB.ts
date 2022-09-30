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
import { OrganizationDB } from './OrganizationDB';
import { UserDB } from './UserDB';

export type OrganizationOwnerAttr = {
  /**
   * @format uuid
   */
  user_id: string;
  /**
   * @format uuid
   */
  organization_id: string;
};

@Table({
  ...defaultModelOptions,
  tableName: 'organizations_owners',
  timestamps: false,
})
export class OrganizationOwnerDB extends Model<OrganizationOwnerAttr> {
  @ForeignKey(() => UserDB)
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.UUID)
  user_id!: OrganizationOwnerAttr['user_id'];
  @BelongsTo(() => UserDB, 'user_id')
  user!: UserDB;

  @ForeignKey(() => OrganizationDB)
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.UUID)
  organization_id!: OrganizationOwnerAttr['organization_id'];
  @BelongsTo(() => OrganizationDB, 'organization_id')
  organization!: OrganizationDB;
}
