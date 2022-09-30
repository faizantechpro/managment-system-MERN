import { QuizAttrs } from 'lib/middlewares/sequelize';
import { DataTypes, Model, Sequelize } from 'sequelize';

export type QuizAttributes = QuizAttrs;

export class QuizModel extends Model<QuizAttributes> implements QuizAttributes {
  public id!: string;
  public intro!: string;
  public description?: string;
  public status!: string;
  public minimum_score!: number;
  public max_attempts?: number;
  public timeopen!: number;
  public timeclose!: number;
  public timelimit!: number;
  public attempts!: number;
  public deleted!: boolean;
  public tenant_id!: string;
}

export function QuizRepository(sqlz: Sequelize) {
  return QuizModel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      intro: DataTypes.STRING,
      description: DataTypes.STRING,
      status: DataTypes.STRING,
      minimum_score: DataTypes.INTEGER,
      max_attempts: DataTypes.INTEGER,
      timeopen: DataTypes.BIGINT,
      timeclose: DataTypes.BIGINT,
      timelimit: DataTypes.BIGINT,
      attempts: DataTypes.INTEGER,
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tenant_id: { type: DataTypes.UUID, allowNull: false }
    },
    {
      tableName: 'quizzes',
      sequelize: sqlz,
      underscored: true,
      timestamps: true,
    }
  );
}
