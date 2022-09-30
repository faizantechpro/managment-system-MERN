import { Pagination } from 'lib/dao';
import { Course } from 'lib/database';
import { BadgeModifyBiz, BadgeQueryBiz } from 'lib/middlewares/sequelize';
import { Biz } from './utils';
import { TenantQuery, UserQuery } from './utils/ContextQuery';

export class BadgeBiz extends Biz {
  async get(
    override: UserQuery | undefined,
    pagination: Pagination,
    query: BadgeQueryBiz
  ) {
    const context = await this.userQuery.build(override);

    return this.services.dao.badge.find(context, pagination, query);
  }

  async getOneById(override: UserQuery | undefined, id: string) {
    const context = await this.userQuery.build(override);

    const badge = await this.services.dao.badge.findOneById(context, id);
    if (!badge) {
      throw new this.exception.ResourceNotFound('badge');
    }
    return badge;
  }

  async create(override: TenantQuery | undefined, payload: BadgeModifyBiz) {
    const context = await this.tenantQuery.build(override);

    return this.services.dao.badge.create({
      ...payload,
      tenant_id: context.tenantId,
    });
  }

  async updateById(
    override: UserQuery | undefined,
    id: string,
    payload: BadgeModifyBiz
  ) {
    const context = await this.userQuery.build(override);

    const badge = await this.services.dao.badge.updateById(
      context,
      id,
      payload
    );
    if (!badge) {
      throw new this.exception.ResourceNotFound('badge');
    }
    return badge;
  }

  async deleteById(override: UserQuery | undefined, id: string) {
    // existence check
    await this.getOneById(override, id);

    /**
     * TODO refactor courses into Biz/DAO layers
     */
    const courses = await Course.findAll({
      where: { badge_id: id },
    });
    const nonPublishedCourses = courses.filter(
      (course) => course.status !== 'published'
    );
    // there are published courses with this badge
    if (nonPublishedCourses.length !== courses.length) {
      throw new this.exception.Conflict('associated to a published course');
    }
    await Promise.all(
      nonPublishedCourses.map((course) =>
        Course.update({ badge_id: null }, { where: { id: course.id } })
      )
    );

    await this.services.dao.badge.deleteById({}, id);
  }
}
