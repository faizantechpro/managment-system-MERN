import { Pagination } from 'lib/dao';
import { GroupCreateBiz, GroupModifyBiz } from 'lib/middlewares/sequelize';
import { TransactionOptions } from 'sequelize/types';
import { Biz } from './utils';
import { UserQuery } from './utils/ContextQuery';

/**
 * TODO major security flaw
 * 1. Sibling access must be done by authorized people
 */

export class GroupBiz extends Biz {
  async getFullHierarchy(override: UserQuery | undefined) {
    const context = await this.userQuery.build(override);

    const rootGroup = await this.getRootGroup(override);
    const children = await this.services.dao.group.findChildrenRecursive(
      context,
      rootGroup
    );

    return {
      ...rootGroup,
      children,
    };
  }

  async get(override: UserQuery | undefined, pagination: Pagination) {
    const context = await this.userQuery.build(override);

    return this.services.dao.group.find(context, pagination);
  }

  async getOneById(
    override: UserQuery | undefined,
    id: string,
    opts: TransactionOptions = {}
  ) {
    const context = await this.userQuery.build(override);

    const group = await this.services.dao.group.findOneById(context, id, opts);
    if (!group) {
      throw new this.exception.ResourceNotFound('group');
    }
    return group;
  }

  // Retrieves the root group of the tenant. There should only be one root group
  async getRootGroup(override: UserQuery | undefined) {
    const context = await this.tenantQuery.build(override);

    const rootGroup = await this.services.dao.group.findOneRootGroup(context);
    if (!rootGroup) {
      throw new this.exception.ResourceNotFound('root group');
    }
    return rootGroup;
  }

  async create(
    override: UserQuery | undefined,
    payload: GroupCreateBiz,
    opts: TransactionOptions = {}
  ) {
    const context = await this.tenantQuery.build(override);

    if (payload.parent_id) {
      await this.requireParent(override, payload.parent_id);
    }
    if (!payload.parent_id) {
      const rootGroup = await this.services.dao.group.findOneRootGroup(context);
      if (rootGroup) {
        throw new this.exception.Conflict('root group already exists');
      }
    }

    return this.services.dao.group.create(
      {
        ...payload,
        tenant_id: context.tenantId,
      },
      opts
    );
  }

  async updateById(
    override: UserQuery | undefined,
    id: string,
    payload: GroupModifyBiz
  ) {
    const context = await this.userQuery.build(override);

    const updatedGroup = await this.services.dao.group.updateById(
      context,
      id,
      payload
    );
    if (!updatedGroup) {
      throw new this.exception.ResourceNotFound('group');
    }

    return updatedGroup;
  }

  async deleteById(
    override: UserQuery | undefined,
    id: string,
    transferId: string // group to transfer users to
  ) {
    const context = await this.userQuery.build(override);

    await this.services.dao.group.transaction(async (transaction) => {
      // Deleting is not part of groupDAO as we perform group transferring as a biz rule
      await Promise.all([
        this.services.dao.group.updateByParentId(
          context,
          id,
          { parent_id: transferId },
          { transaction }
        ),
        this.services.dao.userAuthorization.updateByGroupId(
          context,
          id,
          { groupId: transferId },
          { transaction }
        ),
        this.services.dao.group.deleteById(context, id, { transaction }),
      ]);
    });
  }

  async requireParent(override: UserQuery | undefined, parentId: string) {
    const context = await this.tenantQuery.build(override);

    const parent = await this.services.dao.group.findOneById(context, parentId);
    if (!parent) {
      throw new this.exception.ResourceNotFound('parent group');
    }
  }
}
