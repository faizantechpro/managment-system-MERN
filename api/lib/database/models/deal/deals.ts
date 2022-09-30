import { DealAttr } from 'lib/middlewares/sequelize';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { StaticModel } from '../../helpers';

export type DealsAttributes = DealAttr;

export type DealsModifyAttributes = Optional<DealsAttributes, 'id'>;

export type DealsModel = Model<DealsAttributes, DealsModifyAttributes>;

type DealsStatic = StaticModel<DealsModel>;

export function DealsRepository(sqlz: Sequelize) {
  return <DealsStatic>sqlz.define(
    'deals',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: DataTypes.STRING, // title
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
      description: DataTypes.STRING,
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
      deal_type: DataTypes.ENUM('cold', 'warm', 'hot', 'won', 'lost'),
      lead_source: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      currency: DataTypes.STRING,
      date_closed: DataTypes.DATE,
      next_step: DataTypes.STRING,
      sales_stage: DataTypes.STRING,
      probability: DataTypes.INTEGER,
      date_won_closed: DataTypes.DATE,
      date_lost_closed: DataTypes.DATE,
      last_status_update: DataTypes.DATE,
      status: DataTypes.ENUM('won', 'lost'),
      tenant_deal_stage_id: {
        type: DataTypes.UUID,
        references: {
          model: 'tenant_deal_stage',
          key: 'id',
        },
      },
      contact_person_id: {
        type: DataTypes.UUID,
        references: {
          model: 'contacts',
          key: 'id',
        },
      },
      contact_organization_id: {
        type: DataTypes.UUID,
        references: {
          model: 'organizations',
          key: 'id',
        },
      },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
      position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      tableName: 'deals',
      underscored: true,
      timestamps: false,
    }
  );
}
