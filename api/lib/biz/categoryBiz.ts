import { Pagination } from 'lib/dao';
import { Course, Lesson } from 'lib/database';
import { AuthorizationService } from 'lib/services/authorization';
import { permissions } from 'lib/utils/permissions';
import {
  CategoryCreateBiz,
  CategoryModifyBiz,
  GetCategoriesQuery,
  GetCategoryCoursesQuery,
  GetCategoryLessonsQuery,
} from 'lib/middlewares/sequelize';
import { Biz } from './utils';
import { UserQuery } from './utils/ContextQuery';
import { Op } from 'sequelize';

export class CategoryBiz extends Biz {
  async get(
    override: UserQuery | undefined,
    pagination: Pagination,
    query: GetCategoriesQuery
  ) {
    // TODO refactor this to be in Context or middleware
    const hasAccess = await AuthorizationService.validatePermissions(
      this.user.roles,
      permissions.categories.view
    );
    if (!this.user.auth.isAdmin && !this.user.auth.isOwner && !hasAccess) {
      throw new this.exception.Forbidden('Unable to view categories');
    }

    // TODO clean this up
    const value = query?.order && query?.order[0];
    // TODO may need to fix this....
    let order: string[] | undefined = [];
    // TODO fix ordering by counts...
    if (value && ['totalLessons', 'totalCourses'].includes(value[0])) {
      order = query.order;
      query.order = ['updated_at', 'desc'];
    }

    // TODO clean this up too....
    if (this.user.auth.isAdmin) {
      (query as any).status = {
        [Op.or]: ['published', 'draft'],
      };
    }

    const context = await this.userQuery.build(override);

    return this.services.dao.category.find(context, pagination, query);
  }

  async getCoursesById(
    override: UserQuery | undefined,
    id: number,
    pagination: Pagination,
    query: GetCategoryCoursesQuery
  ) {
    await this.getOneById(override, id);

    const context = await this.services.biz.course.getSelfContext(
      override,
      query
    );

    return this.services.dao.course.findByCategoryId(
      context,
      id,
      pagination,
      query
    );
  }

  async getLessonsById(
    override: UserQuery | undefined,
    id: number,
    pagination: Pagination,
    query: GetCategoryLessonsQuery
  ) {
    await this.getOneById(override, id);

    const context = await this.services.biz.lesson.getSelfContext(
      override,
      query
    );

    return this.services.dao.lesson.findByCategoryId(context, id, pagination, {
      ...query,
      // todo remove this when we have a better way to handle this
      ...(this.user.auth.isAdmin
        ? { status: ["eq 'published'", "eq 'draft'"] }
        : { status: "eq 'published'" }),
    });
  }

  async getOneById(override: UserQuery | undefined, id: number) {
    const context = await this.userQuery.build(override);

    const category = await this.services.dao.category.findOneById(context, id);
    if (!category) {
      throw new this.exception.ResourceNotFound('category');
    }
    return category;
  }

  async create(override: UserQuery | undefined, payload: CategoryCreateBiz) {
    const context = await this.tenantQuery.build(override);

    return this.services.dao.category.create({
      ...payload,
      tenant_id: context.tenantId,
    });
  }

  async updateById(
    override: UserQuery | undefined,
    id: number,
    payload: CategoryModifyBiz
  ) {
    const context = await this.userQuery.build(override);

    const category = await this.services.dao.category.updateById(
      context,
      id,
      payload
    );
    if (!category) {
      throw new this.exception.ResourceNotFound('category');
    }
    return category;
  }

  async deleteById(override: UserQuery | undefined, id: number) {
    const context = await this.userQuery.build(override);

    const { totalLessons } = await this.getOneById(override, id);
    if (totalLessons > 0) {
      throw new this.exception.Conflict('Category is assigned to lessons');
    }

    // this is carried over from the old implementation, may need to be revisited
    await Promise.all([
      Lesson.update({ category_id: null }, { where: { category_id: id } }),
      Course.update({ category_id: null }, { where: { category_id: id } }),
    ]);
    await this.services.dao.category.deleteById(context, id);
  }
}
