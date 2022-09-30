import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
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
import { LessonProgressDB } from './LessonProgressDB';

export type LessonAttrs = {
  id: number;
  title: string;
  content?: string;
  category_id?: number | null;
  max_points?: number;
  max_attempts?: number;
  documents?: string;
  duration?: number; // total seconds a lesson should take
  isPublic: boolean;
  tags?: string;
  icon?: string;
  status?: string; // TODO make this enum
  tenant_id: string;
};

export type LessonAttr = LessonAttrs & ModelTimestamp;

export type LessonQueryStatusQuery =
  | "eq 'draft'"
  | "eq 'published'"
  | "ne 'deleted'";

export type LessonQueryDAO = {
  categoryId?: number;
  favorites?: Favorites;
  include?: ('badge' | 'category' | Includeable)[];
  order?: Order[];
  progress?: Progress;
  search?: Search;
  status?: LessonQueryStatusQuery | LessonQueryStatusQuery[];
};

export type GetLessonsQuery = {
  favorites?: Favorites;
  order?: Order[];
  progress?: Progress;
  search?: Search;
  status?: LessonQueryStatusQuery | LessonQueryStatusQuery[];
};

@Table({
  ...defaultModelOptions,
  tableName: 'lessons',
})
export class LessonDB extends Model<LessonAttr> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: LessonAttr['id'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: LessonAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: LessonAttr['title'];

  @Column(DataType.TEXT)
  content!: LessonAttr['content'];

  @ForeignKey(() => CategoryDB)
  @Column(DataType.INTEGER)
  category_id!: LessonAttr['category_id'];
  @BelongsTo(() => CategoryDB, 'category_id')
  category!: CategoryDB;

  @Column(DataType.INTEGER)
  max_points!: LessonAttr['max_points'];

  @Column(DataType.INTEGER)
  max_attempts!: LessonAttr['max_attempts'];

  @Column(DataType.STRING)
  documents!: LessonAttr['documents'];

  @Column(DataType.INTEGER)
  duration!: LessonAttr['duration'];

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    field: 'isPublic',
  })
  isPublic!: LessonAttr['isPublic'];

  @Column(DataType.STRING)
  tags!: LessonAttr['tags'];

  @Column(DataType.STRING)
  icon!: LessonAttr['icon'];

  @Column(DataType.STRING)
  status!: LessonAttr['status'];

  @HasMany(() => LessonProgressDB)
  progress!: LessonProgressDB[];
}
