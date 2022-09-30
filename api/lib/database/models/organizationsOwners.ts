import { OrganizationOwnerAttr } from 'lib/middlewares/sequelize';
import { Model, DataTypes, Sequelize } from 'sequelize';
import { defaultModelOptions, StaticModel } from '../helpers';

export type OrganizationOwnersAttributes = OrganizationOwnerAttr;

export type OrganizationOwnersModel = Model<OrganizationOwnersAttributes>;

type OrganizationOwnerStatic = StaticModel<OrganizationOwnersModel>;

export function OrganizationOwnersRepository(sqlz: Sequelize) {
  return <OrganizationOwnerStatic>sqlz.define(
    'organizations_owner',
    {
      user_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
      organization_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: 'organizations_owners',
      ...defaultModelOptions,
      timestamps: false,
    }
  );
}
