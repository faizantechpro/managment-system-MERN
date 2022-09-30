import { ProductAttrs } from 'lib/middlewares/sequelize';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { StaticModel } from '../helpers';

export type ProductsAttributes = ProductAttrs;
export type ProductCreationAttributes = Optional<ProductsAttributes, 'id'>;
export type ProductsModel = Model<
  ProductsAttributes,
  ProductCreationAttributes
>;

type ProductStatic = StaticModel<ProductsModel>;

export function ProductsRepository(sqlz: Sequelize) {
  return <ProductStatic>sqlz.define(
    'products',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      category: DataTypes.STRING,
      unit: DataTypes.STRING,
      price: DataTypes.FLOAT,
      tax: DataTypes.STRING,
      description: DataTypes.STRING,
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: 'products',
      underscored: true,
      timestamps: true,
    }
  );
}
