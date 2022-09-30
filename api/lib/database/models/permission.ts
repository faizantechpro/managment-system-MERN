import { PermissionAttr } from 'lib/middlewares/sequelize';
import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export type PermissionAttributes = PermissionAttr;

export type PermissionPk = 'id';
export type PermissionId = PermissionRepository[PermissionPk];
export type PermissionCreationAttributes = Optional<
  PermissionAttributes,
  PermissionPk
>;

export class PermissionRepository
  extends Model<PermissionAttributes, PermissionCreationAttributes>
  implements PermissionAttributes
{
  id!: number;
  role?: string;
  collection!: string;
  action!: string;
  permissions?: any;
  validation?: any;
  presets?: any;
  fields?: string;
  limit?: number;
  tenant_id!: string;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof PermissionRepository {
    PermissionRepository.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        role: {
          type: DataTypes.UUID,
          references: {
            model: 'roles',
            key: 'id',
          },
        },
        collection: {
          type: DataTypes.STRING(64),
          allowNull: false,
        },
        action: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        permissions: {
          type: DataTypes.JSON,
        },
        validation: {
          type: DataTypes.JSON,
        },
        presets: {
          type: DataTypes.JSON,
        },
        fields: {
          type: DataTypes.TEXT,
        },
        limit: {
          type: DataTypes.INTEGER,
        },
        tenant_id: { type: DataTypes.UUID, allowNull: false },
      },
      {
        sequelize,
        tableName: 'permissions',
        timestamps: false,
      }
    );
    return PermissionRepository;
  }
}
