import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  AllowNull,
  PrimaryKey,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { defaultModelOptions } from '../types';
import { ContactDB } from './ContactDB';
import { DealProductDB } from './DealProductDB';
import { DealStageDB } from './DealStageDB';
import { FeedDB } from './FeedDB';
import { OrganizationDB } from './OrganizationDB';
import { TenantDB } from './TenantDB';
import { UserDB } from './UserDB';

const dealTypes = ['cold', 'warm', 'hot', 'won', 'lost'] as const;
export type DealType = typeof dealTypes[number];
const dealStatuses = ['won', 'lost'] as const;
export type DealStatus = typeof dealStatuses[number];

export type DealAttr = {
  /**
   * @format uuid
   */
  id: string;
  name?: string;
  date_entered?: Date;
  date_modified?: Date;
  /**
   * @format uuid
   */
  modified_user_id?: string;
  /**
   * @format uuid
   */
  created_by: string;
  description?: string;
  deleted?: boolean;
  /**
   * @format uuid
   */
  assigned_user_id?: string;
  deal_type?: DealType;
  lead_source?: string;
  amount?: number;
  currency?: string;
  date_closed?: Date;
  next_step?: string;
  sales_stage?: string;
  probability?: number;
  /**
   * @format uuid
   */
  contact_person_id?: string | null;
  /**
   * @format uuid
   */
  contact_organization_id?: string | null;
  date_won_closed?: Date;
  date_lost_closed?: Date;
  last_status_update?: Date;
  /**
   * @format uuid
   */
  tenant_id?: string;
  position: number;
  /**
   * @format uuid
   */
  tenant_deal_stage_id?: string;
  status?: DealStatus;
};

@Table({
  ...defaultModelOptions,
  tableName: 'deals',
  timestamps: false,
})
export class DealDB extends Model<DealAttr> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: DealAttr['id'];

  @HasMany(() => FeedDB, 'deal_id')
  feeds!: FeedDB[];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: DealAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;

  @Column(DataType.STRING)
  name!: DealAttr['name'];

  @Column(DataType.DATE)
  date_entered!: DealAttr['date_entered'];

  @Column(DataType.DATE)
  date_modified!: DealAttr['date_modified'];

  @ForeignKey(() => UserDB)
  @Column(DataType.UUID)
  modified_user_id!: DealAttr['modified_user_id'];
  @BelongsTo(() => UserDB, 'modified_user_id')
  modified_user!: UserDB;

  // TODO make this not null column
  @ForeignKey(() => UserDB)
  @Column(DataType.UUID)
  created_by!: DealAttr['created_by'];
  @BelongsTo(() => UserDB, 'created_by')
  deal_created_by!: UserDB;

  @Column(DataType.STRING)
  description!: DealAttr['description'];

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  deleted!: DealAttr['deleted'];

  @ForeignKey(() => UserDB)
  @Column(DataType.UUID)
  assigned_user_id!: DealAttr['assigned_user_id'];
  @BelongsTo(() => UserDB, 'assigned_user_id')
  assigned_user!: UserDB;

  @Column(DataType.ENUM(...dealTypes))
  deal_type!: DealAttr['deal_type'];

  @Column(DataType.STRING)
  lead_source!: DealAttr['lead_source'];

  @Column(DataType.INTEGER)
  amount!: DealAttr['amount'];

  @Column(DataType.STRING)
  currency!: DealAttr['currency'];

  @Column(DataType.DATE)
  date_closed!: DealAttr['date_closed'];

  @Column(DataType.STRING)
  next_step!: DealAttr['next_step'];

  @Column(DataType.STRING)
  sales_stage!: DealAttr['sales_stage'];

  @Column(DataType.INTEGER)
  probability!: DealAttr['probability'];

  @ForeignKey(() => ContactDB)
  @Column(DataType.UUID)
  contact_person_id!: DealAttr['contact_person_id'];
  @BelongsTo(() => ContactDB, 'contact_person_id')
  contact!: ContactDB;

  @ForeignKey(() => OrganizationDB)
  @Column(DataType.UUID)
  contact_organization_id!: DealAttr['contact_organization_id'];
  @BelongsTo(() => OrganizationDB, 'contact_organization_id')
  organization!: OrganizationDB;

  @Column(DataType.DATE)
  date_won_closed!: DealAttr['date_won_closed'];

  @Column(DataType.DATE)
  date_lost_closed!: DealAttr['date_lost_closed'];

  @Column(DataType.DATE)
  last_status_update!: DealAttr['last_status_update'];

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  position!: DealAttr['position'];

  @ForeignKey(() => DealStageDB)
  @Column(DataType.UUID)
  tenant_deal_stage_id!: DealAttr['tenant_deal_stage_id'];

  @Column(DataType.ENUM(...dealStatuses))
  status!: DealAttr['status'];

  @BelongsToMany(() => DealDB, () => DealProductDB, 'deal_id')
  products!: DealProductDB[];
}
