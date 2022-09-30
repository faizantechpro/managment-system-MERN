import { CourseLessonAttr } from 'lib/middlewares/sequelize';
import { DataTypes, Model, Sequelize } from 'sequelize';

export type CourseLessonAttibutes = CourseLessonAttr;

export class CourseLessonModel
  extends Model<CourseLessonAttibutes>
  implements CourseLessonAttibutes
{
  public id!: number;
  public position!: number;
  public lesson_id!: number;
  public course_id!: string;
}

export function CourseLessonRepository(sqlz: Sequelize) {
  return CourseLessonModel.init(
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      lesson_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // TODO what..? should be PK course_id + lesson_id
        references: {
          model: 'lessons',
          key: 'id',
        },
      },
      course_id: {
        type: DataTypes.UUID,
        references: {
          model: 'courses',
          key: 'id',
        },
      },
      position: DataTypes.INTEGER,
    },
    {
      tableName: 'courses_lessons',
      sequelize: sqlz,
      underscored: true,
      timestamps: false,
    }
  );
}
