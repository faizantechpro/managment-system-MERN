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
import { defaultModelOptions, ModelTimestamp, ToCreateType } from '../types';
import { NaicsDB } from './NaicsDB';
import { PickNotUndefined } from 'lib/utils';

export type NaicsCrossReferenceAttr = {
  /**
   * @format uuid
   */
  id: string;
  code: string;
  cross_reference_code: string;
  cross_reference: string;
} & ModelTimestamp;

export type NaicsCrossReferenceCreateDAO = ToCreateType<
  NaicsCrossReferenceAttr,
  never,
  'id',
  never
>;

@Table({
  ...defaultModelOptions,
  tableName: 'naics_cross_reference',
})
export class NaicsCrossReferenceDB extends Model<
  NaicsCrossReferenceAttr,
  PickNotUndefined<NaicsCrossReferenceCreateDAO>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: NaicsCrossReferenceAttr['id'];

  @ForeignKey(() => NaicsDB)
  @AllowNull(false)
  @Column(DataType.STRING)
  code!: NaicsCrossReferenceAttr['code'];
  @BelongsTo(() => NaicsDB, 'code')
  naics!: NaicsDB;

  @ForeignKey(() => NaicsDB)
  @AllowNull(false)
  @Column(DataType.STRING)
  cross_reference_code!: NaicsCrossReferenceAttr['cross_reference_code'];
  @BelongsTo(() => NaicsDB, 'cross_reference_code')
  naics_cross_reference!: NaicsDB;

  @AllowNull(false)
  @Column(DataType.TEXT)
  cross_reference!: NaicsCrossReferenceAttr['cross_reference'];
}
