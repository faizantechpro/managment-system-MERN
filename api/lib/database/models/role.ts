import { RoleAttr } from 'lib/middlewares/sequelize';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { StaticModel } from '../helpers';

export type RolesAttributes = RoleAttr;

export type RolesCreationAttributes = Optional<RolesAttributes, 'id'>;
export type RolesModel = Model<RolesAttributes, RolesCreationAttributes>;

type RolesStatic = StaticModel<RolesModel>;

export function RolesRepository(sqlz: Sequelize) {
  return <RolesStatic>sqlz.define(
    'roles',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      icon: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'supervised_user_circle',
      },
      description: {
        type: DataTypes.TEXT,
      },
      ip_access: {
        type: DataTypes.TEXT,
      },
      enforce_tfa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      module_list: {
        type: DataTypes.JSON,
      },
      collection_list: {
        type: DataTypes.JSON,
      },
      admin_access: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      owner_access: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      app_access: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: 'roles',
      timestamps: false,
    }
  );
}
