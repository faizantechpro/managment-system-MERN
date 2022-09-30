import { OptionalNullable } from 'lib/utils';
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
import { defaultModelOptions, ModelTimestamp } from '../types';
import { LessonDB } from './LessonDB';
import { TenantDB } from './TenantDB';
import { UserDB } from './UserDB';

export const lessonProgressStatuses = [
  'in_progress',
  'completed',
  'failed',
  'pending',
] as const;
export type LessonProgressStatus = typeof lessonProgressStatuses[number];

export type LessonProgressAttrs = {
  id: number;
  page_id?: number;
  progress?: number;
  status?: LessonProgressStatus;
  is_favorited?: number; // 0/1
  attempts?: number;
  points?: number;
  started_at?: Date;
  completed_at?: Date;
  last_attempted_at?: Date;
  user_id: string; // TODO should be required in db
  lesson_id: number; // TODO should be required in db
  tenant_id: string;
};

export type LessonProgressAttr = LessonProgressAttrs & ModelTimestamp;

export type LessonProgressCreateDAO = OptionalNullable<
  Omit<LessonProgressAttr, 'id' | keyof ModelTimestamp>
>;

@Table({
  ...defaultModelOptions,
  tableName: 'lesson_trackings',
})
export class LessonProgressDB extends Model<LessonProgressAttr> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: LessonProgressAttr['id'];

  @Column(DataType.INTEGER)
  page_id!: LessonProgressAttr['page_id'];

  @Column(DataType.INTEGER)
  progress!: LessonProgressAttr['progress'];

  @Column(DataType.ENUM(...lessonProgressStatuses))
  status!: LessonProgressAttr['status'];

  @Column(DataType.INTEGER)
  is_favorited!: LessonProgressAttr['is_favorited']; // 0/1

  @Column(DataType.INTEGER)
  attempts!: LessonProgressAttr['attempts'];

  @Column(DataType.INTEGER)
  points!: LessonProgressAttr['points'];

  @Column(DataType.DATE)
  started_at!: LessonProgressAttr['started_at'];

  @Column(DataType.DATE)
  completed_at!: LessonProgressAttr['completed_at'];

  @Column(DataType.DATE)
  last_attempted_at!: LessonProgressAttr['last_attempted_at'];

  @ForeignKey(() => UserDB)
  @Column(DataType.UUID)
  user_id!: LessonProgressAttr['user_id'];
  @BelongsTo(() => UserDB, 'user_id')
  user!: UserDB;

  @ForeignKey(() => LessonDB)
  @Column(DataType.INTEGER)
  lesson_id!: LessonProgressAttr['lesson_id'];
  @BelongsTo(() => LessonDB, 'lesson_id')
  lesson!: LessonDB;

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: LessonProgressAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;
}
