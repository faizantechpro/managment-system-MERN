import {
  Column,
  DataType,
  Default,
  Model,
  AllowNull,
  PrimaryKey,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { defaultModelOptions, ModelTimestamp } from '../types';
import { DealDB } from './DealDB';
import { OrganizationDB } from './OrganizationDB';
import { TenantDB } from './TenantDB';
import { UserDB } from './UserDB';

export type ActivityAttrs = {
  /**
   * @format uuid
   */
  id: string;
  name: string;
  type: string;
  /**
   * @format uuid
   */
  assigned_user_id: string;
  /**
   * @format uuid
   */
  modified_user_id: string;
  /**
   * @format uuid
   */
  created_by: string;
  /**
   * @format uuid
   */
  organization_id?: string;
  /**
   * @format uuid
   */
  deal_id?: string;
  start_date: Date;
  end_date: Date;
  guests: string;
  location?: string;
  conference_link?: string;
  description?: string;
  free_busy: string;
  notes?: string;
  rich_note?: object;
  owner?: string;
  lead?: string;
  done: boolean;
  /**
   * @format uuid
   */
  feed_id: string;
  /**
   * @format uuid
   */
  tenant_id: string;
  deleted_on?: Date;
};

export type ActivityAttr = ActivityAttrs & ModelTimestamp;

@Table({
  ...defaultModelOptions,
  tableName: 'activities',
})
export class ActivityDB extends Model<ActivityAttr> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: ActivityAttr['id'];

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: ActivityAttr['name'];

  @AllowNull(false)
  @Column(DataType.STRING)
  type!: ActivityAttr['type'];

  @ForeignKey(() => UserDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  assigned_user_id!: ActivityAttr['assigned_user_id'];
  @BelongsTo(() => UserDB, 'assigned_user_id')
  assigned_user!: UserDB;

  @ForeignKey(() => UserDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  modified_user_id!: ActivityAttr['modified_user_id'];
  @BelongsTo(() => UserDB, 'modified_user_id')
  modified_user!: UserDB;

  @AllowNull(false)
  @Column(DataType.UUID)
  created_by!: ActivityAttr['created_by'];

  @ForeignKey(() => OrganizationDB)
  @Column(DataType.UUID)
  organization_id!: ActivityAttr['organization_id'];
  @BelongsTo(() => OrganizationDB, 'organization_id')
  organization!: OrganizationDB;

  @ForeignKey(() => DealDB)
  @Column(DataType.UUID)
  deal_id!: ActivityAttr['deal_id'];
  @BelongsTo(() => DealDB, 'deal_id')
  deal!: DealDB;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  start_date!: ActivityAttr['start_date'];

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  end_date!: ActivityAttr['end_date'];

  @AllowNull(false)
  @Column(DataType.STRING)
  guests!: ActivityAttr['guests'];

  @AllowNull(false)
  @Column(DataType.STRING)
  location!: ActivityAttr['location'];

  @AllowNull(false)
  @Column(DataType.STRING)
  conference_link!: ActivityAttr['conference_link'];

  @AllowNull(false)
  @Column(DataType.STRING)
  description!: ActivityAttr['description'];

  @AllowNull(false)
  @Column(DataType.STRING)
  free_busy!: ActivityAttr['free_busy'];

  @AllowNull(false)
  @Column(DataType.STRING)
  notes!: ActivityAttr['notes'];

  @Column(DataType.JSON)
  rich_note!: ActivityAttr['rich_note'];

  @AllowNull(false)
  @Column(DataType.UUID)
  owner!: ActivityAttr['owner'];

  @AllowNull(false)
  @Column(DataType.STRING)
  lead!: ActivityAttr['lead'];

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  done!: ActivityAttr['done'];

  // feed
  @AllowNull(false)
  @Column(DataType.UUID)
  feed_id!: ActivityAttr['feed_id'];

  // TODO add tenant FK
  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: ActivityAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;

  @Column(DataType.DATE)
  deleted_on!: ActivityAttr['deleted_on'];
}
