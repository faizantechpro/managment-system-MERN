import {
  QuizQuestionAttrs,
  QuizQuestionOption,
} from 'lib/middlewares/sequelize';
import { DataTypes, Model, Sequelize } from 'sequelize';

export type QuestionAttibutes = QuizQuestionAttrs;

export class QuestionModel
  extends Model<QuestionAttibutes>
  implements QuestionAttibutes
{
  public id!: string;
  public title!: string;
  public quiz_id!: string;
  public content!: string;
  public type!: string;
  public qtype!: string;
  public qoption!: QuizQuestionOption[];
  public order!: number;
  public feedback!: string;
  public points!: number;
  public tenant_id!: string;
}

export function QuestionRepository(sqlz: Sequelize) {
  return QuestionModel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      quiz_id: { type: DataTypes.UUID, allowNull: false },
      content: DataTypes.TEXT,
      type: DataTypes.STRING,
      qtype: DataTypes.STRING,
      qoption: DataTypes.JSON,
      order: DataTypes.INTEGER,
      feedback: DataTypes.STRING,
      points: DataTypes.INTEGER,
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: 'questions',
      sequelize: sqlz,
      underscored: true,
      timestamps: true,
    }
  );
}
