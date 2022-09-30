import { ContactOwnerAttr } from 'lib/middlewares/sequelize';
import { Model, DataTypes, Sequelize } from 'sequelize';
import { defaultModelOptions, StaticModel } from '../helpers';

export type ContactOwnersAttributes = ContactOwnerAttr;

export type ContactOwnersModel = Model<ContactOwnersAttributes>;

type ContactOwnerStatic = StaticModel<ContactOwnersModel>;

export function ContactOwnersRepository(sqlz: Sequelize) {
  return <ContactOwnerStatic>sqlz.define(
    'contacts_owners',
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
      },
    },
    {
      tableName: 'contacts_owners',
      ...defaultModelOptions,
      timestamps: false,
    }
  );
}
