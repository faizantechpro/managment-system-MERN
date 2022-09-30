import { Model, DataTypes, Sequelize } from 'sequelize';
import { defaultModelOptions, StaticModel } from '../helpers';

export type ContactFollowersAttributes = {
  user_id: string;
  contact_id: string;
  tenant_id?: string;
};

export type ContactFollowersModel = Model<ContactFollowersAttributes>;

type ContactFollowerStatic = StaticModel<ContactFollowersModel>;

export function ContactFollowersRepository(sqlz: Sequelize) {
  return <ContactFollowerStatic>sqlz.define(
    'contacts_followers',
    {
      user_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
      contact_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      }
    },
    {
      tableName: 'contacts_followers',
      ...defaultModelOptions,
      timestamps: false,
    }
  );
}
