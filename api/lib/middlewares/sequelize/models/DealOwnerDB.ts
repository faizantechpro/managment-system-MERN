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
import { DealDB } from './DealDB';
import { UserDB } from './UserDB';

export type DealOwnerAttr = {
  /**
   * @format uuid
   */
  user_id: string;
  /**
   * @format uuid
   */
  deal_id: string;
};

@Table({
  ...defaultModelOptions,
  tableName: 'deal_owners',
  timestamps: false,
})
export class DealOwnerDB extends Model<DealOwnerAttr> {
  @ForeignKey(() => UserDB)
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.UUID)
  user_id!: DealOwnerAttr['user_id'];
  @BelongsTo(() => UserDB, 'user_id')
  user!: UserDB;

  @ForeignKey(() => DealDB)
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.UUID)
  deal_id!: DealOwnerAttr['deal_id'];
  @BelongsTo(() => DealDB, 'deal_id')
  deal!: DealDB;
}
