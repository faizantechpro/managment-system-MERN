import { CourseProgressAttrs } from 'lib/middlewares/sequelize';
import { Model, DataTypes, Sequelize } from 'sequelize';

export type CourseProgressAttributes = CourseProgressAttrs;

export class CourseProgressModel
  extends Model<CourseProgressAttributes>
  implements CourseProgressAttributes
{
  public id!: string;
  public user_id!: string;
  public course_id!: string;
  public is_favorite!: boolean;
  public started_at!: Date;
  public completed_at!: Date;
  public last_attempted_at!: Date;

  // sequelize doesn't expose this by default lol
  public dataValues!: CourseProgressAttributes;
  public tenant_id!: string;
}

export function CourseProgressRepository(sqlz: Sequelize) {
  return CourseProgressModel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: DataTypes.STRING,
      course_id: DataTypes.UUID,
      is_favorite: { type: DataTypes.BOOLEAN, defaultValue: false },
      started_at: DataTypes.DATE,
      completed_at: DataTypes.DATE,
      last_attempted_at: DataTypes.DATE,
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      sequelize: sqlz,
      tableName: 'course_progress',
      underscored: true,
      // underscored writes to db as underscored but not in model...
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'course_id'],
        },
      ],
    }
  );
}
