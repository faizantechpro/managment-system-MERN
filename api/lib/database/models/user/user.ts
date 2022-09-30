import { UserAttr } from 'lib/middlewares/sequelize';
import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { StaticModel } from '../../helpers';

export type UserAttributes = UserAttr;

export type UserCreationAttributes = Optional<UserAttributes, 'id'>;
export type UserModel = Model<UserAttributes, UserCreationAttributes>;

type UserStatic = StaticModel<UserModel>;

export function UserRepository(sqlz: Sequelize) {
  return <UserStatic>sqlz.define(
    'users',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      location: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      tags: DataTypes.JSON,
      avatar: DataTypes.STRING,
      status: DataTypes.STRING,
      role: DataTypes.UUID,
      last_access: DataTypes.DATE,
      last_page: DataTypes.STRING,
      phone: DataTypes.STRING,
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: 'users',
      timestamps: false,
      underscored: true,
    }
  );
}
