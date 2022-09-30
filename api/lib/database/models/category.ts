import { CategoryAttr } from 'lib/middlewares/sequelize';
import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { StaticModel, defaultModelOptions } from '../helpers';

export type CategoryAttributes = CategoryAttr;

export type CategoryModifyAttributes = Optional<CategoryAttributes, 'id'>;
export type CategoryModel = Model<CategoryAttributes, CategoryModifyAttributes>;

type CategoryStaticModel = StaticModel<CategoryModel>;

export function CategoryRepository(sqlz: Sequelize) {
  return sqlz.define(
    'categories',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      status: DataTypes.STRING,
      logo: DataTypes.STRING,
      icon: DataTypes.STRING,
      position: DataTypes.INTEGER,
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      ...defaultModelOptions,
      tableName: 'categories',
    }
  ) as CategoryStaticModel;
}
