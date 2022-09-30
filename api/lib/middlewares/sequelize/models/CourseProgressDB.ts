import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { defaultModelOptions, ModelTimestamp } from '../types';
import { CourseDB } from './CourseDB';
import { TenantDB } from './TenantDB';
import { UserDB } from './UserDB';

export type CourseProgressAttrs = {
  id: string; // TODO make user_id+course_id composite primary key
  user_id: string; // TODO make required in db
  course_id: string; // TODO make required in db
  is_favorite?: boolean;
  started_at?: Date;
  completed_at?: Date;
  last_attempted_at?: Date;
  tenant_id: string;
};

export type CourseProgressAttr = CourseProgressAttrs & ModelTimestamp;

@Table({
  ...defaultModelOptions,
  tableName: 'course_progress',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'course_id'],
    },
  ],
})
export class CourseProgressDB extends Model<CourseProgressAttr> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: CourseProgressAttr['id'];

  @ForeignKey(() => UserDB)
  @Column(DataType.UUID)
  user_id!: CourseProgressAttr['user_id'];
  @BelongsTo(() => UserDB)
  user!: UserDB;

  @ForeignKey(() => CourseDB)
  @Column(DataType.UUID)
  course_id!: CourseProgressAttr['course_id'];
  @BelongsTo(() => CourseDB, 'course_id')
  course!: CourseDB;

  @Default(false)
  @Column(DataType.BOOLEAN)
  is_favorite!: CourseProgressAttr['is_favorite'];

  @Column(DataType.DATE)
  started_at!: CourseProgressAttr['started_at'];

  @Column(DataType.DATE)
  completed_at!: CourseProgressAttr['completed_at'];

  @Column(DataType.DATE)
  last_attempted_at!: CourseProgressAttr['last_attempted_at'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: CourseProgressAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;
}
