import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { defaultModelOptions, ModelTimestamp } from '../types';
import { ActivityDB } from './ActivityDB';
import { ContactDB } from './ContactDB';
import { DealDB } from './DealDB';
import { OrganizationDB } from './OrganizationDB';
import { TenantDB } from './TenantDB';
import { UserDB } from './UserDB';

export type FeedAttrs = {
  /**
   * @format uuid
   */
  id: string;
  summary: string;
  type: string;
  object_data: any;
  content?: string;
  /**
   * @format uuid
   */
  created_by: string;
  /**
   * @format uuid
   */
  updated_by?: string;
  /**
   * @format uuid
   */
  contact_id?: string;
  /**
   * @format uuid
   */
  organization_id?: string;
  /**
   * @format uuid
   */
  deal_id?: string;
  created_on?: Date; // TODO remove this redundant field, already tracked with created_at
  /**
   * @format uuid
   */
  tenant_id: string;
};

export type FeedAttr = FeedAttrs & ModelTimestamp;

@Table({
  ...defaultModelOptions,
  tableName: 'feed',
})
export class FeedDB extends Model<FeedAttr> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: FeedAttr['id'];

  @HasMany(() => ActivityDB, 'feed_id')
  activities!: ActivityDB[];

  @Column(DataType.STRING)
  summary!: FeedAttr['summary'];

  @AllowNull(false)
  @Column(DataType.STRING)
  type!: FeedAttr['type'];

  @Column(DataType.JSON)
  object_data!: FeedAttr['object_data'];

  @Column(DataType.STRING)
  content!: FeedAttr['content'];

  // TODO rename to created_by_info and created_by
  @ForeignKey(() => UserDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  created_by!: FeedAttr['created_by'];
  @BelongsTo(() => UserDB, 'created_by')
  created_by_info!: UserDB;

  // TODO rename to updated_by_id and updated_by
  @ForeignKey(() => UserDB)
  @Column(DataType.UUID)
  updated_by!: FeedAttr['updated_by'];
  @BelongsTo(() => UserDB, 'updated_by')
  updated_by_info!: UserDB;

  @ForeignKey(() => ContactDB)
  @Column(DataType.UUID)
  contact_id!: FeedAttr['contact_id'];
  @BelongsTo(() => ContactDB, 'contact_id')
  contact!: ContactDB;

  @ForeignKey(() => OrganizationDB)
  @Column(DataType.UUID)
  organization_id!: FeedAttr['organization_id'];
  @BelongsTo(() => OrganizationDB, 'organization_id')
  organization!: OrganizationDB;

  @ForeignKey(() => DealDB)
  @Column(DataType.UUID)
  deal_id!: FeedAttr['deal_id'];
  @BelongsTo(() => DealDB, 'deal_id')
  deal!: DealDB;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_on!: FeedAttr[]; // TODO remove this redundant field, already tracked with created_'created_on'at

  // TODO add tenant FK
  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: FeedAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;
}
