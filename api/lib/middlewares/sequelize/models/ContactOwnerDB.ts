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
import { ContactDB } from './ContactDB';
import { UserDB } from './UserDB';

export type ContactOwnerAttr = {
  /**
   * @format uuid
   */
  user_id: string;
  /**
   * @format uuid
   */
  contact_id: string;
};

@Table({
  ...defaultModelOptions,
  tableName: 'contacts_owners',
  timestamps: false,
})
export class ContactOwnerDB extends Model<ContactOwnerAttr> {
  @ForeignKey(() => UserDB)
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.UUID)
  user_id!: ContactOwnerAttr['user_id'];
  @BelongsTo(() => UserDB, 'user_id')
  user!: UserDB;

  @ForeignKey(() => ContactDB)
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.UUID)
  contact_id!: ContactOwnerAttr['contact_id'];
  @BelongsTo(() => ContactDB, 'contact_id')
  contact!: ContactDB;
}
