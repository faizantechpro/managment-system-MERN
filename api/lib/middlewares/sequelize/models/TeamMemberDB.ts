import { PickNotUndefined } from 'lib/utils';
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
import {
  camelModelOptions,
  Order,
  Timestamp,
  ToCreateType,
  ToModifyType,
} from '../types';
import { TeamDB } from './TeamDB';
import { UserDB } from './UserDB';

export type TeamMemberAttr = {
  /**
   * @format uuid
   */
  teamId: string;
  /**
   * @format uuid
   */
  userId: string;
  /**
   * Only one manager is allowed per team
   */
  isManager: boolean;
  deletedAt?: Date | null;
} & Timestamp;

export type TeamMemberQueryDAO = {
  isManager?: boolean;
};
export type TeamMemberCreateDAO = ToCreateType<
  TeamMemberAttr,
  'deletedAt',
  never,
  'isManager'
>;
export type TeamMemberModifyDAO = ToModifyType<TeamMemberCreateDAO, 'userId'>;

export type GetTeamsQuery = {
  order?: Order[];
};
export type TeamMemberCreateBiz = Omit<
  TeamMemberCreateDAO,
  'tenantId' | 'teamId' | 'userId'
>;

@Table({
  ...camelModelOptions,
  tableName: 'teamMember',
})
export class TeamMemberDB extends Model<
  TeamMemberAttr,
  PickNotUndefined<TeamMemberCreateDAO>
> {
  // only really needed because we use deletedAt... otherwise its unnecessary
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => TeamDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  teamId!: TeamMemberAttr['teamId'];
  @BelongsTo(() => TeamDB, 'teamId')
  team!: TeamDB;

  @ForeignKey(() => UserDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  userId!: TeamMemberAttr['userId'];
  @BelongsTo(() => UserDB, 'userId')
  user!: UserDB;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isManager!: TeamMemberAttr['isManager'];

  @Column(DataType.DATE)
  deletedAt!: TeamMemberAttr['deletedAt'];
}
