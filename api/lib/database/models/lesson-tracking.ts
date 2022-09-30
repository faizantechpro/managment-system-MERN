import { LessonProgressAttrs } from 'lib/middlewares/sequelize/models';
import { Model, ModelDefined, DataTypes, Sequelize } from 'sequelize';

export type LessonTrackingAttributes = LessonProgressAttrs;

export interface LessonTrackingModel
  extends Model<LessonTrackingAttributes>,
    LessonTrackingAttributes {}

export function LessonTrackingRepository(
  sqlz: Sequelize
): ModelDefined<LessonTrackingModel, LessonTrackingAttributes> {
  return sqlz.define(
    'lesson_tracking',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: DataTypes.STRING,
      lesson_id: DataTypes.INTEGER,
      page_id: DataTypes.INTEGER,
      progress: DataTypes.INTEGER,
      status: DataTypes.ENUM('in_progress', 'completed', 'failed', 'pending'),
      is_favorited: DataTypes.INTEGER,
      attempts: DataTypes.INTEGER,
      points: DataTypes.INTEGER,
      started_at: DataTypes.DATE,
      completed_at: DataTypes.DATE,
      last_attempted_at: DataTypes.DATE,
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    { underscored: true }
  );
}
