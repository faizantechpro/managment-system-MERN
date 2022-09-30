import { AuthUser } from 'lib/middlewares/auth';
import { Forbidden } from 'lib/middlewares/exception';

export class Guest {
  private user: AuthUser;

  constructor(user: AuthUser) {
    this.user = user;
  }

  validate(organizationId: string) {
    if (
      this.user.jwt.scope !== 'guest' ||
      this.user.jwt.resource_access.organization[0].id !== organizationId
    ) {
      throw new Forbidden();
    }
  }
}
