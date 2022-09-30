import { LessonPageAttrs } from 'lib/middlewares/sequelize/models';
import { Model, ModelDefined, DataTypes, Sequelize } from 'sequelize';

export type LessonPageAttributes = LessonPageAttrs;

// You can also set multiple attributes optional at once
export interface LessonPageModel
  extends Model<LessonPageAttributes>,
    LessonPageAttributes {}

export function LessonPageRepository(
  sqlz: Sequelize
): ModelDefined<LessonPageModel, LessonPageAttributes> {
  return sqlz.define(
    'lesson_pages',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      lesson_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      type: DataTypes.STRING,
      qtype: DataTypes.STRING,
      qoption: DataTypes.JSON,
      order: DataTypes.INTEGER,
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    { underscored: true }
  );
}
