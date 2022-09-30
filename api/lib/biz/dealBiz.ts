import { Biz } from './utils';
import { UserQuery } from './utils/ContextQuery';

export class DealBiz extends Biz {
  async findAllAsStageSummary(
    override: UserQuery | undefined,
    query: {
      start_date?: string;
      end_date?: string;
      search?: string;
      status?: string;
    } & {
      [k in string]: any;
    }
  ) {
    const context = await this.userQuery.build(override);

    return this.services.dao.deal.findAllAsStageSummary(context, query);
  }
}
