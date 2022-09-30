import { defaultModelOptions, StaticModel } from 'lib/database/helpers';
import { UserCredentialAttr } from 'lib/middlewares/sequelize';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type UserCredentialAttributes = UserCredentialAttr;

export type UserCredentialModifyAttributes = Optional<
  UserCredentialAttributes,
  'user_id'
>;
export type UserCredentialModel = Model<
  UserCredentialAttributes,
  UserCredentialModifyAttributes
>;

type UserCredentialStatic = StaticModel<UserCredentialModel>;

export function UserCredentialRepository(sqlz: Sequelize) {
  return sqlz.define(
    'user_credential',
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      password: DataTypes.STRING,
      tfa_secret: DataTypes.STRING,
    },
    {
      tableName: 'user_credential',
      ...defaultModelOptions,
      timestamps: false,
    }
  ) as UserCredentialStatic;
}
