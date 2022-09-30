import { Model, DataTypes, Sequelize } from 'sequelize';

type AddTime = {
  amount: number;
  unit: string;
};

type Settings = {
  dealsUpdates: boolean;
  mentionsAndComments: boolean;
  associations: boolean;
  updatesTime: string;
  remindMyActivities: boolean;
  remindTime: string;
  customRemindTime: AddTime;
  separateActivities: boolean;
};

export interface NotificationSettingsAttributes {
  id?: number;
  user_id: string;
  settings: Settings;
  tenant_id: string;
}

export class NotificationSettingsModel
  extends Model<NotificationSettingsAttributes>
  implements NotificationSettingsAttributes
{
  public id!: number;
  public user_id!: string;
  public settings!: Settings;
  public tenant_id!: string;
}

export function NotificationSettingsRepository(sqlz: Sequelize) {
  return NotificationSettingsModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: { type: DataTypes.UUID, allowNull: false, unique: true },
      settings: { type: DataTypes.JSON, allowNull: true },
      tenant_id: { type: DataTypes.UUID, allowNull: false }
    },
    {
      tableName: 'notification_settings',
      sequelize: sqlz,
      underscored: true,
      timestamps: true,
    }
  );
}
