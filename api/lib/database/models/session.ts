import { Model, ModelDefined, DataTypes, Optional, Sequelize } from 'sequelize';

export interface SessionsAttributes {
  token?: string;
  user?: string;
  expires?: Date;
  ip?: string | null | undefined;
  user_agent?: string | null | undefined;
  tenant_id?: string;
}

export interface SessionModel
  extends Model<SessionsAttributes>,
    SessionsAttributes {}

export function SessionRepository(
  sqlz: Sequelize
): ModelDefined<SessionModel, SessionsAttributes> {
  return sqlz.define(
    'sessions',
    {
      token: DataTypes.STRING,
      user: DataTypes.UUID,
      expires: DataTypes.DATE,
      ip: DataTypes.STRING,
      user_agent: DataTypes.STRING,
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    { underscored: true }
  );
}
