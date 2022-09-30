import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { defaultModelOptions, ModelTimestamp } from '../types';
import { TenantDB } from './TenantDB';

export type QuizAttrs = {
  /**
   * @format uuid
   */
  id: string;
  intro?: string;
  description?: string;
  status?: string;
  minimum_score: number;
  max_attempts?: number;
  timeopen?: number;
  timeclose?: number;
  timelimit?: number;
  attempts?: number;
  deleted?: boolean;
  /**
   * @format uuid
   */
  tenant_id: string;
};

export type QuizAttr = QuizAttrs & ModelTimestamp;

@Table({
  ...defaultModelOptions,
  tableName: 'quizzes',
})
export class QuizDB extends Model<QuizAttr> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: QuizAttr['id'];

  @Column(DataType.STRING)
  intro!: QuizAttr['intro'];

  @Column(DataType.STRING)
  description!: QuizAttr['description'];

  @Column(DataType.STRING)
  status!: QuizAttr['status'];

  @Column(DataType.INTEGER)
  minimum_score!: QuizAttr['minimum_score'];

  @Column(DataType.INTEGER)
  max_attempts!: QuizAttr['max_attempts'];

  @Column(DataType.BIGINT)
  timeopen!: QuizAttr['timeopen'];

  @Column(DataType.BIGINT)
  timeclose!: QuizAttr['timeclose'];

  @Column(DataType.BIGINT)
  timelimit!: QuizAttr['timelimit'];

  @Column(DataType.INTEGER)
  attempts!: QuizAttr['attempts'];

  @Default(false)
  @Column(DataType.BOOLEAN)
  deleted!: QuizAttr['deleted'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: QuizAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;
}
