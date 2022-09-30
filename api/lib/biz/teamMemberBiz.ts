import { Pagination } from 'lib/dao';
import { TeamMemberCreateBiz } from 'lib/middlewares/sequelize';
import { TransactionOptions } from 'sequelize/types';
import { Biz } from './utils';
import { UserQuery } from './utils/ContextQuery';

export class TeamMemberBiz extends Biz {
  async getByTeamId(
    override: UserQuery | undefined,
    teamId: string,
    pagination: Pagination
  ) {
    const context = await this.tenantQuery.build(override);

    // ensure team exists
    await this.services.biz.team.getOneById(override, teamId);

    return this.services.dao.teamMember.findByTeamId(
      context,
      teamId,
      pagination
    );
  }

  async createByCompositeIds(
    override: UserQuery | undefined,
    teamId: string,
    userId: string,
    payload: TeamMemberCreateBiz,
    opts: TransactionOptions = {}
  ) {
    const context = await this.tenantQuery.build(override);

    await this.services.biz.team.getOneById(override, teamId);

    if (payload.isManager) {
      const {
        data: [manager],
      } = await this.services.dao.teamMember.findByTeamId(
        context,
        teamId,
        { page: 1, limit: 1 },
        { isManager: true }
      );
      if (manager && manager.userId !== userId) {
        throw new this.exception.Conflict('maximum of one manager is allowed');
      }
    }

    const teamMember = await this.services.dao.teamMember.create(
      context,
      { ...payload, teamId, userId },
      opts
    );
    return teamMember;
  }

  async deleteByCompositeIds(
    override: UserQuery | undefined,
    teamId: string,
    userId: string,
    opts: TransactionOptions = {}
  ) {
    const context = await this.tenantQuery.build(override);

    await this.services.biz.team.getOneById(override, teamId);

    await this.services.dao.teamMember.deleteByCompositeIds(
      context,
      teamId,
      userId,
      opts
    );

    return;
  }
}
