import { StaticModel } from 'lib/database/helpers';
import { Model } from 'sequelize';
import BaseLog from './BaseLog';

/**
 * Provides an abstract class to restrict a user based on the context of
 * their authorization level.
 */
export default abstract class ContextQuery<
  T extends Model,
  U extends StaticModel<T> = StaticModel<T>
> extends BaseLog<T, U> {
  protected abstract getContextQuery(
    filterKey?: string
  ): ReturnType<BaseLog<T>['getWhere']>;

  protected async defaultFindById(id: string) {
    return super.defaultFindById(id, {
      where: this.getContextQuery(),
    });
  }

  protected async defaultUpdateById(
    id: string,
    payload: Parameters<U['update']>[0]
  ) {
    return super.defaultUpdateById(id, payload, {
      where: this.getContextQuery(),
    });
  }

  protected async defaultDeleteById(id: string | string[]) {
    return super.defaultDeleteById(id, {
      where: this.getContextQuery(),
    });
  }
}
