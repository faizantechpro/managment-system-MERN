import { defaultModelOptions, StaticModel } from 'lib/database/helpers';
import { GroupAttrs } from 'lib/middlewares/sequelize';
import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export type GroupsAttr = GroupAttrs;

export type GroupsAttributes = GroupsAttr;
export type GroupsModifyAttributes = Optional<GroupsAttributes, 'id'>;
export type GroupsModel = Model<GroupsAttributes, GroupsModifyAttributes>;
type GroupsStatic = StaticModel<GroupsModel>;

export function GroupsRepository(sqlz: Sequelize) {
  return sqlz.define(
    'groups',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      parent_id: {
        type: DataTypes.UUID,
      },
      has_sibling_access: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      deleted_on: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'groups',
      ...defaultModelOptions,
    }
  ) as GroupsStatic;
}
