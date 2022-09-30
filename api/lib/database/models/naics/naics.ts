import { defaultModelOptions, StaticModel } from 'lib/database/helpers';
import { NaicsAttr } from 'lib/middlewares/sequelize/models';
import { DataTypes, Model, Sequelize } from 'sequelize';

type NAICSAttributes = NaicsAttr;

export type NAICSModel = Model<NAICSAttributes>;

type NAICSStatic = StaticModel<NAICSModel>;

export function NAICSRepository(sqlz: Sequelize) {
  return sqlz.define(
    'naics',
    {
      code: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'naics',
      ...defaultModelOptions,
    }
  ) as NAICSStatic;
}
