import {
  Column,
  DataType,
  Default,
  Model,
  AllowNull,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { defaultModelOptions, ModelTimestamp } from '../types';

export type DealStageAttrs = {
  /**
   * @format uuid
   */
  id: string;
  name: string;
  description?: string;
  is_default?: boolean;
  deleted_on?: Date;
};

export type DealStageAttr = DealStageAttrs & ModelTimestamp;

@Table({
  ...defaultModelOptions,
  tableName: 'deal_stage',
})
export class DealStageDB extends Model<DealStageAttr> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: DealStageAttr['id'];

  @AllowNull(false)
  @Column(DataType.STRING(50))
  name!: DealStageAttr['name'];

  @Column(DataType.TEXT)
  description!: DealStageAttr['description'];

  @Default(false)
  @Column(DataType.BOOLEAN)
  is_default!: DealStageAttr['is_default'];

  @Column(DataType.DATE)
  deleted_on!: DealStageAttr['deleted_on'];
}
