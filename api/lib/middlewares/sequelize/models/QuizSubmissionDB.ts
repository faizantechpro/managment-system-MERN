import { OptionalNullable } from 'lib/utils';
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
import { QuizDB } from './QuizDB';
import { TenantDB } from './TenantDB';
import { UserDB } from './UserDB';

export const quizSubmissionStatuses = ['in-progress', 'pass', 'fail'] as const;
export type QuizSubmissionStatus = typeof quizSubmissionStatuses[number];

export type QuizSubmissionAttrs = {
  id: string;
  user_id: string; // TODO make required in db
  quiz_id: string; // TODO make not null in db
  status?: QuizSubmissionStatus;
  score?: number; // percentage
  tenant_id: string;
};

export type QuizSubmissionAttr = QuizSubmissionAttrs & ModelTimestamp;

export type QuizSubmissionCreateDAO = OptionalNullable<
  Omit<QuizSubmissionAttr, 'id' | keyof ModelTimestamp>
>;

@Table({
  ...defaultModelOptions,
  tableName: 'quiz_submission',
})
export class QuizSubmissionDB extends Model<QuizSubmissionAttr> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: QuizSubmissionAttr['id'];

  @ForeignKey(() => UserDB)
  @Column(DataType.UUID)
  user_id!: QuizSubmissionAttr['user_id'];
  @BelongsTo(() => UserDB)
  user!: UserDB;

  @ForeignKey(() => QuizDB)
  @Column(DataType.UUID)
  quiz_id!: QuizSubmissionAttr['quiz_id'];
  @BelongsTo(() => QuizDB)
  quiz!: QuizDB;

  @Column(DataType.STRING)
  status!: QuizSubmissionAttr['status'];

  @Column(DataType.INTEGER)
  score!: QuizSubmissionAttr['score'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: QuizSubmissionAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;
}
