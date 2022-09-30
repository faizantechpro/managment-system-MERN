import { PickNotUndefined } from 'lib/utils';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import {
  camelModelOptions,
  Timestamp,
  ToCreateType,
  ToModifyType,
} from '../types';
import { TeamMemberAttr, TeamMemberDB } from './TeamMemberDB';
import { TenantDB } from './TenantDB';

export type TeamAttr = {
  /**
   * @format uuid
   */
  id: string;
  /**
   * @format uuid
   */
  tenantId: string;

  /**
   * @maxLength 50
   */
  name: string;
  description?: string | null;
  isActive: boolean;
  deletedAt?: Date | null;
} & Timestamp;

export type TeamCreateDAO = ToCreateType<
  TeamAttr,
  'deletedAt',
  'id',
  'isActive'
>;
export type TeamModifyDAO = ToModifyType<TeamCreateDAO, 'tenantId'>;

export type TeamCreateBiz = Omit<TeamCreateDAO, 'tenantId'> & {
  members: {
    userId: TeamMemberAttr['userId'];
    isManager?: TeamMemberAttr['isManager'];
  }[];
};
export type TeamModifyBiz = TeamModifyDAO;

@Table({
  ...camelModelOptions,
  tableName: 'team',
})
export class TeamDB extends Model<TeamAttr, PickNotUndefined<TeamCreateDAO>> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: TeamAttr['id'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenantId!: TeamAttr['tenantId'];
  @BelongsTo(() => TenantDB, 'tenantId')
  tenant!: TenantDB;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  name!: TeamAttr['name'];

  @Column(DataType.TEXT)
  description!: TeamAttr['description'];

  @Default(true)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isActive!: TeamAttr['isActive'];

  @Column(DataType.DATE)
  deletedAt!: TeamAttr['deletedAt'];

  @HasMany(() => TeamMemberDB, 'teamId')
  members!: TeamMemberDB[];
}
