import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { TenantDB } from './TenantDB';
import { LessonDB } from './LessonDB';
import { defaultModelOptions, ModelTimestamp } from '../types';

export type LessonPageAttrs = {
  id: number;
  title?: string;
  lesson_id?: number; // TODO make this required in db and FK
  content?: string;
  type?: string; // video, quiz, slide, etc.
  qtype?: string;
  qoption?: '';
  order?: number;
  tenant_id: string;
};

export type LessonPageAttr = LessonPageAttrs & ModelTimestamp;

@Table({
  ...defaultModelOptions,
  tableName: 'lesson_pages',
})
export class LessonPageDB extends Model<LessonPageAttr> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: LessonPageAttr['id'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: LessonPageAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;

  @Column(DataType.STRING)
  title!: LessonPageAttr['title'];

  @ForeignKey(() => LessonDB)
  @Column(DataType.INTEGER)
  lesson_id!: LessonPageAttr['lesson_id'];
  @BelongsTo(() => LessonDB, 'lesson_id')
  lesson!: LessonDB;

  @Column(DataType.TEXT)
  content!: LessonPageAttr['content'];

  @Column(DataType.STRING)
  type!: LessonPageAttr['type'];

  @Column(DataType.STRING)
  qtype!: LessonPageAttr['qtype'];

  @Column(DataType.JSON)
  qoption!: LessonPageAttr['qoption'];

  @Column(DataType.INTEGER)
  order!: LessonPageAttr['order'];
}
