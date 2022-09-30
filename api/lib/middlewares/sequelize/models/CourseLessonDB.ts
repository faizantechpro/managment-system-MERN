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
import { defaultModelOptions } from '../types';
import { LessonDB } from './LessonDB';
import { CourseDB } from './CourseDB';

export type CourseLessonAttr = {
  id: number;
  position: number;
  lesson_id: number;
  course_id: string;
};

@Table({
  ...defaultModelOptions,
  tableName: 'courses_lessons',
  timestamps: false,
})
export class CourseLessonDB extends Model<CourseLessonAttr> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: CourseLessonAttr['id'];

  @Column(DataType.INTEGER)
  position!: CourseLessonAttr['position'];

  @ForeignKey(() => LessonDB)
  @AllowNull(false)
  @PrimaryKey
  @Column(DataType.INTEGER)
  lesson_id!: CourseLessonAttr['lesson_id'];
  @BelongsTo(() => LessonDB, 'lesson_id')
  lesson!: LessonDB;

  @ForeignKey(() => CourseDB)
  @Column(DataType.UUID)
  course_id!: CourseLessonAttr['course_id'];
  @BelongsTo(() => CourseDB, 'course_id')
  course!: CourseDB;
}
