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

export type QuizQuestionOption = {
  id: string;
  answer: string;
  correct: boolean;
};

export type QuizQuestionAttrs = {
  id: string;
  title?: string;
  quiz_id: string;
  content?: string;
  type?: string; // quiz, quiz_review.
  qtype?: string;
  qoption?: QuizQuestionOption[];
  order?: number;
  feedback?: string;
  points?: number;
  tenant_id: string;
};

export type QuizQuestionAttr = QuizQuestionAttrs & ModelTimestamp;

@Table({
  ...defaultModelOptions,
  tableName: 'questions',
})
export class QuizQuestionDB extends Model<QuizQuestionAttr> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: QuizQuestionAttr['id'];

  @Column(DataType.STRING)
  title!: QuizQuestionAttr['title'];

  @ForeignKey(() => QuizDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  quiz_id!: QuizQuestionAttr['quiz_id'];
  @BelongsTo(() => QuizDB, 'quiz_id')
  quiz!: QuizDB;

  @Column(DataType.TEXT)
  content!: QuizQuestionAttr['content'];

  @Column(DataType.STRING)
  type!: QuizQuestionAttr['type'];

  @Column(DataType.STRING)
  qtype!: QuizQuestionAttr['qtype'];

  @Column(DataType.JSON)
  qoption!: QuizQuestionAttr['qoption'];

  @Column(DataType.INTEGER)
  order!: QuizQuestionAttr['order'];

  @Column(DataType.STRING)
  feedback!: QuizQuestionAttr['feedback'];

  @Column(DataType.INTEGER)
  points!: QuizQuestionAttr['points'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: QuizQuestionAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;
}
