import {
  QuizSubmissionAttrs,
  QuizSubmissionStatus,
} from 'lib/middlewares/sequelize';
import { DataTypes, Model, Sequelize } from 'sequelize';

export type QuizSubmissionAttributes = QuizSubmissionAttrs;

export class QuizSubmissionModel
  extends Model<QuizSubmissionAttributes>
  implements QuizSubmissionAttributes
{
  public id!: string;
  public user_id!: string;
  public quiz_id!: string;
  public status!: QuizSubmissionStatus;
  public score!: number;

  // sequelize doesn't expose this by default
  public dataValues!: QuizSubmissionAttributes;
  public tenant_id!: string;
}

export function QuizSubmissionRepository(sqlz: Sequelize) {
  return QuizSubmissionModel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      user_id: DataTypes.UUID,
      quiz_id: DataTypes.UUID,
      status: DataTypes.ENUM('in-progress', 'pass', 'fail'),
      score: DataTypes.DECIMAL(10, 2),
      tenant_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      sequelize: sqlz,
      tableName: 'quiz_submission',
      underscored: true,
      // underscored writes to db as underscored but not in model...
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
}
