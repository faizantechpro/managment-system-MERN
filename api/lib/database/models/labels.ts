import { Model, DataTypes, Sequelize } from 'sequelize';

export type labelType = 'organization' | 'contact';

export type LabelsAttributes = {
  id: string;
  name: string;
  color: string;
  assigned_user_id?: string;
  type?: labelType;
  tenant_id: string;
};

export class LabelsModel
  extends Model<LabelsAttributes>
  implements LabelsAttributes
{
  public id!: string;
  public name!: string;
  public color!: string;
  public assigned_user_id!: string;
  public type!: labelType;
  public tenant_id!: string;
}

export function LabelsRepository(sqlz: Sequelize) {
  return LabelsModel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      color: { type: DataTypes.STRING, allowNull: false },
      assigned_user_id: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      type: {
        type: DataTypes.ENUM('organization', 'contact'),
      },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: 'labels',
      sequelize: sqlz,
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
}
