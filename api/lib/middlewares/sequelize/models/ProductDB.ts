import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  AllowNull,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { defaultModelOptions, ModelTimestamp } from '../types';
import { DealDB } from './DealDB';
import { DealProductDB } from './DealProductDB';
import { TenantDB } from './TenantDB';

export type ProductAttrs = {
  /**
   * @format uuid
   */
  id?: string;
  /**
   * @format uuid
   */
  tenant_id?: string;
  name?: string; // TODO make not null?
  price?: number;
  code?: string;
  category?: string;
  unit?: string;
  tax?: string;
  description?: string;
  deleted?: boolean;
};

export type ProductAttr = ProductAttrs & ModelTimestamp;

@Table({
  ...defaultModelOptions,
  tableName: 'products',
})
export class ProductDB extends Model<ProductAttr> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: ProductAttr['id'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: ProductAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;

  @Column(DataType.STRING)
  name!: ProductAttr['name'];

  @Column(DataType.FLOAT)
  price!: ProductAttr['price'];

  @Column(DataType.STRING)
  code!: ProductAttr['code'];

  @Column(DataType.STRING)
  category!: ProductAttr['category'];

  @Column(DataType.STRING)
  unit!: ProductAttr['unit'];

  @Column(DataType.STRING)
  tax!: ProductAttr['tax'];

  @Column(DataType.STRING)
  description!: ProductAttr['description'];

  @Default(false)
  @Column(DataType.BOOLEAN)
  deleted!: ProductAttr['deleted'];

  @BelongsToMany(() => DealDB, () => DealProductDB, 'product_id')
  deals!: DealProductDB[];
}
