import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import {
  defaultModelOptions,
  Favorites,
  ModelTimestamp,
  Order,
  Progress,
  Search,
  ToCreateType,
  ToModifyType,
} from '../types';
import { TenantDB } from './TenantDB';
import { PickNotUndefined } from 'lib/utils';
import { LessonDB } from './LessonDB';
import { CourseDB } from './CourseDB';

export type CategoryAttr = {
  id: number;
  /**
   * @format uuid
   */
  tenant_id: string;
  /**
   * @maxLength 255
   */
  title?: string | null;
  /**
   * @maxLength 255
   */
  description?: string | null;
  /**
   * @maxLength 255
   */
  status?: string | null; // TODO remove this, its course/lesson dependent...
  /**
   * @maxLength 255
   */
  logo?: string | null;
  /**
   * @maxLength 255
   */
  icon?: string | null;
  position?: number | null;
} & ModelTimestamp;

export type CategoryQueryDAO = {
  extraData?: string[]; // TODO remove this
  order?: Order;
  search?: Search;
  // TODO investigate whether this was a workaround
  status?: { [Op.or]: ['published', 'draft'] } | 'published';
};
export type CategoryCreateDAO = ToCreateType<CategoryAttr, never, 'id', never>;
export type CategoryModifyDAO = ToModifyType<CategoryCreateDAO, 'tenant_id'>;

export type GetCategoryTrainingQuery = {
  favorites?: Favorites;
  order?: Order[];
  progress?: Progress;
};
export type GetCategoryCoursesQuery = GetCategoryTrainingQuery;
export type GetCategoryLessonsQuery = GetCategoryTrainingQuery & {
  random?: boolean;
};
export type GetCategoriesQuery = {
  extraData?: string[]; // TODO remove this...
  order?: Order;
  search?: Search;
};
// Previous joi schema...
export type CategoryCreateBiz = {
  /**
   * @maxLength 255
   */
  title: string;
  /**
   * @maxLength 255
   */
  logo?: string | null;
  /**
   * @maxLength 255
   */
  icon?: string | null;
  /**
   * @maxLength 255
   */
  description?: string | null;
};
export type CategoryModifyBiz = CategoryCreateBiz;

@Table({
  ...defaultModelOptions,
  tableName: 'categories',
})
export class CategoryDB extends Model<
  CategoryAttr,
  PickNotUndefined<CategoryCreateDAO>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: CategoryAttr['id'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: CategoryAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;

  @Column(DataType.STRING)
  title!: CategoryAttr['title'];

  @Column(DataType.STRING)
  description!: CategoryAttr['description'];

  @Column(DataType.STRING)
  status!: CategoryAttr['status'];

  @Column(DataType.STRING)
  logo!: CategoryAttr['logo'];

  @Column(DataType.STRING)
  icon!: CategoryAttr['icon'];

  @Column(DataType.INTEGER)
  position!: CategoryAttr['position'];

  @HasMany(() => LessonDB, 'category_id')
  lessons!: LessonDB[];

  @HasMany(() => CourseDB, 'category_id')
  courses!: CourseDB[];
}
