import { Model, DataTypes, Sequelize } from 'sequelize';
import { defaultModelOptions, StaticModel } from '../helpers';

export type OrganizationFollowersAttributes = {
  user_id: string;
  organization_id: string;
  tenant_id?: string;
};

export type OrganizationFollowersModel = Model<OrganizationFollowersAttributes>;

type OrganizationFollowerStatic = StaticModel<OrganizationFollowersModel>;

export function OrganizationFollowersRepository(sqlz: Sequelize) {
  return <OrganizationFollowerStatic>sqlz.define(
    'organizations_followers',
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
      }
    },
    {
      tableName: 'organizations_followers',
      ...defaultModelOptions,
      timestamps: false,
    }
  );
}
