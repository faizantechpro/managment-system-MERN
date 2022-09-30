import { ContactAttr } from 'lib/middlewares/sequelize';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { defaultModelOptions, StaticModel } from '../helpers';

export type ContactAttributes = ContactAttr;

export type ContactModifyAttributes = Optional<ContactAttributes, 'id'>;

export type ContactModel = Model<ContactAttributes, ContactModifyAttributes>;

type ContactStatic = StaticModel<ContactModel>;

export function ContactRepository(sqlz: Sequelize) {
  return <ContactStatic>sqlz.define(
    'contacts',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      date_entered: DataTypes.DATE,
      date_modified: DataTypes.DATE,
      modified_user_id: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      created_by: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      description: DataTypes.TEXT,
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      assigned_user_id: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      salutation: DataTypes.STRING(255),
      first_name: DataTypes.STRING(100),
      last_name: DataTypes.STRING(100),
      title: DataTypes.STRING,
      department: DataTypes.STRING(255),
      do_not_call: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      email_home: DataTypes.STRING,
      email_mobile: DataTypes.STRING,
      email_work: DataTypes.STRING,
      email_other: DataTypes.STRING,
      email_fax: DataTypes.STRING,
      phone_home: DataTypes.STRING(100),
      phone_mobile: DataTypes.STRING(100),
      phone_work: DataTypes.STRING(100),
      phone_other: DataTypes.STRING(100),
      phone_fax: DataTypes.STRING(100),
      primary_address_street: DataTypes.STRING(150),
      primary_address_city: DataTypes.STRING(100),
      primary_address_state: DataTypes.STRING(100),
      primary_address_postalcode: DataTypes.STRING(20),
      primary_address_country: DataTypes.STRING(255),
      alt_address_street: DataTypes.STRING(150),
      alt_address_city: DataTypes.STRING(100),
      alt_address_state: DataTypes.STRING(100),
      alt_address_postalcode: DataTypes.STRING(20),
      alt_address_country: DataTypes.STRING(255),
      assistant: DataTypes.STRING(75),
      assistant_phone: DataTypes.STRING(100),
      lead_source: DataTypes.STRING(255),
      avatar: DataTypes.STRING(255),
      status: DataTypes.STRING(75),
      organization_id: {
        type: DataTypes.UUID,
        references: {
          model: 'organizations',
          key: 'id',
        },
      },
      is_customer: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      cif: DataTypes.STRING(50),
      external_id: {
        type: DataTypes.STRING(64),
      },
      label_id: {
        type: DataTypes.UUID,
        references: {
          model: 'labels',
          key: 'id',
        },
        defaultValue: null,
      },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: 'contacts',
      ...defaultModelOptions,
      timestamps: false,
    }
  );
}
