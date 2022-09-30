import {
  TeamMemberCreateDAO,
  TeamMemberQueryDAO,
  UserAttr,
} from 'lib/middlewares/sequelize';
import { Pagination } from 'lib/types';
import { TransactionOptions } from 'sequelize';
import { ContextQuery } from './utils';
import DAO from './utils/DAO';

export class TeamMemberDAO extends DAO<'TeamMemberDB'> {
  async findByTeamId(
    context: ContextQuery,
    teamId: string,
    pagination: Pagination,
    query: TeamMemberQueryDAO = {}
  ) {
    const builder = this.where();
    builder.merge({ teamId, deletedAt: null });
    builder.context(context);

    if (typeof query.isManager === 'boolean') {
      builder.merge({ isManager: query.isManager });
    }

    const { count, rows } = await this.repo.findAndCountAll({
      include: ['user'],
      where: builder.build(),
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(
      this.rowsToJSON<{ user: UserAttr }>(rows),
      count,
      pagination
    );
  }

  async create(
    context: ContextQuery,
    payload: TeamMemberCreateDAO,
    opts: TransactionOptions = {}
  ) {
    // this is wack but needed because we soft delete...
    const builder = this.where();
    builder.merge({
      teamId: payload.teamId,
      userId: payload.userId,
      deletedAt: null,
    });
    const existing = await this.repo.findOne({
      where: builder.build(),
    });
    if (existing) {
      throw new Error('TeamMember already exists');
    }

    const member = await this.repo.create(payload, opts);

    return this.toJSON(member)!;
  }

  async bulkCreate(
    context: ContextQuery,
    payload: TeamMemberCreateDAO[],
    opts: TransactionOptions = {}
  ) {
    // this is also wack but needed because we soft delete...
    const dedupes = payload.map((p) => `${p.teamId}-${p.userId}`);
    const dedupeSet = new Set(dedupes);
    if (dedupes.length !== dedupeSet.size) {
      throw new Error('Duplicate team members');
    }

    const members = await this.repo.bulkCreate(payload, { ...opts });

    return this.rowsToJSON(members)!;
  }

  async deleteByTeamId(
    context: ContextQuery,
    teamId: string,
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ teamId, deletedAt: null });
    builder.context(context);

    await this.repo.update(
      { deletedAt: new Date() },
      {
        where: builder.build(),
        ...opts,
      }
    );
  }

  async deleteByCompositeIds(
    context: ContextQuery,
    teamId: string,
    userId: string,
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ teamId, userId, deletedAt: null });
    builder.context(context);

    await this.repo.update(
      { deletedAt: new Date() },
      {
        where: builder.build(),
        ...opts,
      }
    );
  }
}
