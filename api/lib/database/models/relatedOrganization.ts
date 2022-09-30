import { defaultModelOptions, StaticModel } from 'lib/database/helpers';
import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export interface RelatedOrganizationAttributes {
  id?: string;
  organization_id: string;
  related_id: string;
  type: string;
  deleted_on?: Date;
  tenant_id: string;
}

export type RelatedOrganizationModifyAttributes = Optional<
  RelatedOrganizationAttributes,
  'id'
>;
export type RelatedOrganizationModel = Model<
  RelatedOrganizationAttributes,
  RelatedOrganizationModifyAttributes
>;
type RelatedOrganizationStatic = StaticModel<RelatedOrganizationModel>;

export function RelatedOrganizationRepository(sqlz: Sequelize) {
  return sqlz.define(
    'related_organization',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      organization_id: {
        type: DataTypes.UUID,
        references: {
          model: 'organizations',
          key: 'id',
        },
        allowNull: false,
      },
      related_id: {
        type: DataTypes.UUID,
        references: {
          model: 'organizations',
          key: 'id',
        },
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('related', 'parent'),
        allowNull: false,
      },
      deleted_on: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      tenant_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'related_organization',
      ...defaultModelOptions,
    }
  ) as RelatedOrganizationStatic;
}
