import { UserAuthorizationModifyBiz } from 'lib/middlewares/sequelize';
import { Biz } from './utils';
import { UserQuery } from './utils/ContextQuery';

export class UserAuthorizationBiz extends Biz {
  async getOneByUserId(override: UserQuery | undefined, userId: string) {
    // TODO this userQuery needs to be able to perform user only checks
    const context = await this.userQuery.build(override);

    const user = await this.services.dao.user.findOneById(context, userId);
    if (!user) {
      throw new this.exception.ResourceNotFound('user');
    }

    const userAuthorization =
      await this.services.dao.userAuthorization.findOneByUserId({}, user.id);
    if (!userAuthorization) {
      // TODO initialize all users with authorization (existing and upon creation)
      return {
        userId: user.id,
        groupId: null,
        roleId: null,
      };
    }
    return userAuthorization;
  }

  async upsert(
    override: UserQuery | undefined,
    userId: string,
    payload: UserAuthorizationModifyBiz
  ) {
    const context = await this.userQuery.build(override);

    const updatedAuthorization =
      await this.services.dao.userAuthorization.upsert(
        context,
        userId,
        payload
      );

    return updatedAuthorization;
  }
}
