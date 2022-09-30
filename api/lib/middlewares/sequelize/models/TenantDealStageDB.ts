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
import { Optional } from 'sequelize';
import { defaultModelOptions, ModelTimestamp } from '../types';
import { DealStageDB } from './DealStageDB';
import { TenantDB } from './TenantDB';

export type TenantDealStageAttrs = {
  /**
   * @format uuid
   */
  id: string;
  active?: boolean;
  position: number;
  probability: number;
  /**
   * @format uuid
   */
  tenant_id: string;
  /**
   * @format uuid
   */
  deal_stage_id: string;
};

export type TenantDealStageAttr = TenantDealStageAttrs & ModelTimestamp;

@Table({
  ...defaultModelOptions,
  tableName: 'tenant_deal_stage',
})
export class TenantDealStageDB extends Model<TenantDealStageAttr> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: TenantDealStageAttr['id'];

  @Default(true)
  @Column(DataType.BOOLEAN)
  active!: TenantDealStageAttr['active'];

  @Column(DataType.INTEGER)
  position!: TenantDealStageAttr['position'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: TenantDealStageAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;

  @ForeignKey(() => DealStageDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  deal_stage_id!: TenantDealStageAttr['deal_stage_id'];
  @BelongsTo(() => DealStageDB, 'deal_stage_id')
  deal_stage!: DealStageDB;
}
