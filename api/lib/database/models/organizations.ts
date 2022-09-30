import { OrganizationAttr } from 'lib/middlewares/sequelize';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { defaultModelOptions, StaticModel } from '../helpers';

export type OrganizationAttributes = OrganizationAttr;

export type OrganizationModifyAttributes = Optional<
  OrganizationAttributes,
  'id'
>;

export type OrganizationModel = Model<
  OrganizationAttributes,
  OrganizationModifyAttributes
>;

type OrganizationStatic = StaticModel<OrganizationModel>;

export function OrganizationRepository(sqlz: Sequelize) {
  return <OrganizationStatic>sqlz.define(
    'organizations',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: DataTypes.STRING,
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
      industry: DataTypes.STRING(150),
      annual_revenue: DataTypes.STRING(100),
      annual_revenue_merchant: DataTypes.STRING(100),
      annual_revenue_treasury: DataTypes.STRING(100),
      annual_revenue_business_card: DataTypes.STRING(100),
      total_revenue: DataTypes.STRING(100),
      phone_fax: DataTypes.STRING(100),
      billing_address_street: DataTypes.STRING(155),
      billing_address_city: DataTypes.STRING(100),
      billing_address_state: DataTypes.STRING(100),
      billing_address_postalcode: DataTypes.STRING(20),
      billing_address_country: DataTypes.STRING(255),
      rating: DataTypes.STRING(100),
      phone_office: DataTypes.STRING(100),
      phone_alternate: DataTypes.STRING(100),
      website: DataTypes.STRING(255),
      employees: {
        type: DataTypes.INTEGER,
      },
      ticker_symbol: DataTypes.STRING(10),
      address_street: DataTypes.STRING(150),
      address_suite: DataTypes.STRING(150),
      address_city: DataTypes.STRING(100),
      address_state: DataTypes.STRING(100),
      address_postalcode: DataTypes.STRING(20),
      address_country: DataTypes.STRING(255),
      sic_code: DataTypes.STRING(10),
      status: DataTypes.STRING(150),
      naics_code: DataTypes.STRING(10),
      is_customer: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      cif: DataTypes.STRING(50),
      branch: DataTypes.STRING(10),
      external_id: {
        type: DataTypes.STRING(64),
      },
      avatar: DataTypes.STRING(255),
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
      tableName: 'organizations',
      ...defaultModelOptions,
      timestamps: false,
    }
  );
}
