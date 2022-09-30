import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Includeable } from 'sequelize';
import {
  defaultModelOptions,
  Favorites,
  ModelTimestamp,
  Order,
  Progress,
  Search,
} from '../types';
import { CategoryDB } from './CategoryDB';
import { TenantDB } from './TenantDB';
import { QuizDB } from './QuizDB';
import { CourseProgressDB } from './CourseProgressDB';
import { BadgeDB } from './BadgeDB';
import { CourseLessonDB } from './CourseLessonDB';
import { LessonDB } from './LessonDB';

export type CourseAttrs = {
  id: string;
  name?: string;
  description?: string;
  status?: string; // TODO make this an enum
  is_learning_path?: boolean;
  isPublic: boolean;
  deleted?: boolean;
  category_id?: number | null; // TODO make required in db
  quiz_id?: string;
  badge_id?: string | null;
  tenant_id: string;
};

export type CourseAttr = CourseAttrs & ModelTimestamp;

export type CourseQueryStatusQuery = "eq 'draft'" | "eq 'published'";

export type CourseQueryDAO = {
  categoryId?: number;
  favorites?: Favorites;
  include?: ('badge' | 'category' | Includeable)[];
  order?: Order[];
  progress?: Progress;
  search?: Search;
  status?: CourseQueryStatusQuery | CourseQueryStatusQuery[];
  totalLessons?: boolean;
};

export type GetCoursesQuery = {
  favorites?: Favorites;
  order?: Order[];
  progress?: Progress;
  search?: Search;
  status?: CourseQueryStatusQuery | CourseQueryStatusQuery[];
};

@Table({
  ...defaultModelOptions,
  tableName: 'courses',
})
export class CourseDB extends Model<CourseAttr> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: CourseAttr['id'];

  @Column(DataType.STRING)
  name!: CourseAttr['name'];

  @Column(DataType.STRING)
  description!: CourseAttr['description'];

  @Column(DataType.STRING)
  status!: CourseAttr['status'];

  @Column(DataType.BOOLEAN)
  is_learning_path!: CourseAttr['is_learning_path'];

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    field: 'isPublic',
  })
  isPublic!: CourseAttr['isPublic'];

  @Default(false)
  @Column(DataType.BOOLEAN)
  deleted!: CourseAttr['deleted'];

  @ForeignKey(() => CategoryDB)
  @Column(DataType.INTEGER)
  category_id!: CourseAttr['category_id'];
  @BelongsTo(() => CategoryDB, 'category_id')
  category!: CategoryDB;

  @ForeignKey(() => QuizDB)
  @Column(DataType.UUID)
  quiz_id!: CourseAttr['quiz_id'];
  @BelongsTo(() => QuizDB, 'quiz_id')
  quiz!: QuizDB;

  @ForeignKey(() => BadgeDB)
  @Column(DataType.UUID)
  badge_id!: CourseAttr['badge_id'];
  @BelongsTo(() => BadgeDB, 'badge_id')
  badge!: BadgeDB;

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: CourseAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;

  @HasMany(() => CourseProgressDB)
  progress!: CourseProgressDB[];

  @HasMany(() => CourseLessonDB)
  courseLessons!: CourseLessonDB[];

  @BelongsToMany(() => LessonDB, () => CourseLessonDB, 'course_id')
  lessons!: (LessonDB & { courseLesson: CourseLessonDB })[];
}
