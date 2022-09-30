import { DataTypes, Model, Sequelize } from 'sequelize';
import { defaultModelOptions, StaticModel } from 'lib/database/helpers';

type RPMGVerticalAttributes = {
  id: string;
  industry: string;
  description: string;
};

export type RPMGVerticalModel = Model<RPMGVerticalAttributes>;

type RPMGVerticalStatic = StaticModel<RPMGVerticalModel>;

export function RPMGVerticalRepository(sqlz: Sequelize) {
  return sqlz.define(
    'rpmg_vertical',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'rpmg_vertical',
      ...defaultModelOptions,
    }
  ) as RPMGVerticalStatic;
}
