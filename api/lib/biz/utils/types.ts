import { Resources } from 'lib/dao';
import { AuthUser } from 'lib/middlewares/auth';
import { ContextServices } from 'lib/middlewares/context';
import { exception } from 'lib/middlewares/exception';
import { DB } from 'lib/middlewares/sequelize';

export type BizOpts<T extends Resources = Resources> = {
  // for abstract biz classes
  type?: T;

  db: DB['models'];
  exception: typeof exception;
  services: ContextServices;
  user: AuthUser;
};
