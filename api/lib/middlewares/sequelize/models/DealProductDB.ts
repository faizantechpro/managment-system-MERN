import {
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { defaultModelOptions } from '../types';
import { DealDB } from './DealDB';
import { ProductDB } from './ProductDB';

export type DealProductAttr = {
  /**
   * @format uuid
   */
  id: string;
  /**
   * @format uuid
   */
  product_id?: string;
  quantity?: number;
  price?: number;
  /**
   * @format uuid
   */
  deal_id?: string;
};

@Table({
  ...defaultModelOptions,
  timestamps: false,
  tableName: 'deal_products',
})
export class DealProductDB extends Model<DealProductAttr> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: DealProductAttr['id'];

  @ForeignKey(() => ProductDB)
  @Column(DataType.UUID)
  product_id!: DealProductAttr['product_id'];

  @ForeignKey(() => DealDB)
  @Column(DataType.UUID)
  deal_id!: DealProductAttr['deal_id'];

  @Column(DataType.INTEGER)
  quantity!: DealProductAttr['quantity'];

  @Column(DataType.FLOAT)
  price!: DealProductAttr['price'];
}
