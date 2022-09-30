import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  AllowNull,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { defaultModelOptions, ModelTimestamp, ToCreateType } from '../types';
import { NaicsCrossReferenceDB } from './NaicsCrossReferenceDB';
import { NaicsSpDB } from './NaicsSpDB';
import { PickNotUndefined } from 'lib/utils';

export type NaicsAttr = {
  code: string;
  title: string;
} & ModelTimestamp;

export type NaicsCreateDAO = ToCreateType<NaicsAttr, never, never, never>;

@Table({
  ...defaultModelOptions,
  tableName: 'naics',
})
export class NaicsDB extends Model<NaicsAttr, PickNotUndefined<NaicsAttr>> {
  @PrimaryKey
  @Column(DataType.STRING)
  code!: NaicsAttr['code'];

  @HasOne(() => NaicsSpDB, 'code')
  naics_sp!: NaicsSpDB;
  @HasMany(() => NaicsCrossReferenceDB, 'code')
  naics!: NaicsCrossReferenceDB[];
  @HasMany(() => NaicsCrossReferenceDB, 'cross_reference_code')
  naics_cross_reference!: NaicsCrossReferenceDB[];

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: NaicsAttr['title'];
}
