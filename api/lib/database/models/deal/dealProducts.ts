import { DealProductAttr } from 'lib/middlewares/sequelize';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

import { StaticModel } from '../../helpers';

export type DealProductsAttributes = DealProductAttr;

export type DealProductsModifyAttributes = Optional<
  DealProductsAttributes,
  'id'
>;

export type DealProductsModel = Model<
  DealProductsAttributes,
  DealProductsModifyAttributes
>;

type DealProductsStatic = StaticModel<DealProductsModel>;

export function DealProductsRepository(sqlz: Sequelize) {
  return <DealProductsStatic>sqlz.define(
    'dealProducts',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.UUID,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      quantity: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
      deal_id: {
        type: DataTypes.UUID,
        references: {
          model: 'deals',
          key: 'id',
        },
      },
    },
    {
      tableName: 'deal_products',
      underscored: true,
      timestamps: false,
    }
  );
}
