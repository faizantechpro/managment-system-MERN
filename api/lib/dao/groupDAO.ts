import { GroupCreateDAO, GroupModifyDAO } from 'lib/middlewares/sequelize';
import { TransactionOptions } from 'sequelize/types';
import { ContextQuery, Pagination } from './utils';
import DAO from './utils/DAO';

type RootGroup = NonNullable<Awaited<ReturnType<GroupDAO['findOneRootGroup']>>>;
type GroupNode = RootGroup & { children: GroupNode[] };

export class GroupDAO extends DAO<'GroupDB'> {
  async findChildrenRecursive(
    context: ContextQuery,
    group: NonNullable<Awaited<ReturnType<GroupDAO['findOneRootGroup']>>>
  ): Promise<GroupNode[]> {
    const builder = this.where();
    builder.merge({
      parent_id: group.id,
      deleted_on: null,
    });
    builder.context(context);

    const children = await this.repo.findAll({
      where: builder.build(),
    });

    return Promise.all(
      children.map(async (child) => {
        const formattedChild = this.toJSON(child)!;

        const innerChildren = await this.findChildrenRecursive(
          context,
          formattedChild
        );
        return {
          ...formattedChild,
          children: innerChildren,
        };
      })
    );
  }

  async find(context: ContextQuery, pagination: Pagination) {
    const builder = this.where();
    builder.context(context);

    const { count, rows } = await this.repo.findAndCountAll({
      where: builder.build(),
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(this.rowsToJSON(rows), count, pagination);
  }

  async findOneById(
    context: ContextQuery,
    id: string,
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ id });
    builder.merge({ deleted_on: null });
    builder.context(context);

    const group = await this.repo.findOne({
      where: builder.build(),
      ...opts,
    });

    return this.toJSON(group);
  }

  async findOneRootGroup(context: ContextQuery) {
    const builder = this.where();
    builder.merge({ parent_id: null });
    builder.merge({ deleted_on: null });
    builder.context(context);

    const group = await this.repo.findOne({
      where: builder.build(),
    });

    return this.toJSON(group);
  }

  async create(payload: GroupCreateDAO, opts: TransactionOptions = {}) {
    const group = await this.repo.create(payload, opts);

    return this.toJSON(group)!;
  }

  async updateById(
    context: ContextQuery,
    id: string,
    payload: GroupModifyDAO,
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ id });
    builder.merge({ deleted_on: null });
    builder.context(context);

    const [, [group]] = await this.repo.update(payload, {
      returning: true,
      where: builder.build(),
      ...opts,
    });

    return this.toJSON(group);
  }

  async updateByParentId(
    context: ContextQuery,
    parentId: string,
    payload: GroupModifyDAO,
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ parent_id: parentId });
    builder.merge({ deleted_on: null });
    builder.context(context);

    await this.repo.update(payload, {
      where: builder.build(),
      ...opts,
    });
  }

  async deleteById(
    context: ContextQuery,
    id: string,
    opts: TransactionOptions = {}
  ) {
    const builder = this.where();
    builder.merge({ id });
    builder.merge({ deleted_on: null });
    builder.context(context);

    await this.repo.update(
      { deleted_on: new Date() },
      {
        where: builder.build(),
        ...opts,
      }
    );
  }
}
