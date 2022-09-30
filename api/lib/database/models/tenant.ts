import { TenantAttrs } from 'lib/middlewares/sequelize';
import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { defaultModelOptions, StaticModel } from '../helpers';

export type TenantAttributes = TenantAttrs;

export type TenantPk = 'id';
export type TenantCreationAttributes = Optional<TenantAttributes, TenantPk>;

export interface TenantModel
  extends Model<TenantAttributes>,
    TenantCreationAttributes {}

type TenantStatic = StaticModel<TenantModel>;

export function TenantRepository(sqlz: Sequelize) {
  return <TenantStatic>sqlz.define(
    'tenants',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      type: { type: DataTypes.STRING(100), allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      domain: { type: DataTypes.STRING(100), allowNull: false },
      modules: { type: DataTypes.TEXT, allowNull: false },
      colors: { type: DataTypes.JSON, allowNull: false },
      logo: { type: DataTypes.TEXT, allowNull: false },
      icon: { type: DataTypes.TEXT, allowNull: true },
      use_logo: { type: DataTypes.BOOLEAN, defaultValue: false },
      settings: { type: DataTypes.JSON, allowNull: true },
    },
    { ...defaultModelOptions }
  );
}
