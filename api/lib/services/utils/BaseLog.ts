import { StaticModel } from 'lib/database/helpers';
import { AuthUser } from 'lib/middlewares/auth';
import { Model } from 'sequelize';
import { feedLogServiceFactory } from '../feed/feedLog';
import Base from './Base';

export default abstract class BaseLog<
  T extends Model,
  U extends StaticModel<T> = StaticModel<T>
> extends Base<T, U> {
  protected feedLog: ReturnType<typeof feedLogServiceFactory>;

  constructor(model: U, user: AuthUser) {
    super(model, user);

    this.feedLog = feedLogServiceFactory(user);
  }
}
