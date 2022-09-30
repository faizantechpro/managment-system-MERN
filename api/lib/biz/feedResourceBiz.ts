import {
  DealDAO,
  FeedResourceDAOFactory,
  Pagination,
  Resources,
} from 'lib/dao';
import { Biz, BizOpts } from './utils';
import { OwnableQuery } from './utils/ContextQuery';

export type FeedResourceBizFactory<T extends Resources> = T extends 'contact'
  ? ContactFeedBiz
  : T extends 'deal'
  ? DealFeedBiz
  : T extends 'organization'
  ? OrganizationFeedBiz
  : never;

abstract class FeedResourceBiz<Resource extends Resources> extends Biz {
  public feedResourceDAO: FeedResourceDAOFactory<Resource>['dao'];

  constructor(
    feedResourceDAO: FeedResourceDAOFactory<Resource>['dao'],
    ...args: ConstructorParameters<typeof Biz>
  ) {
    super(...args);

    this.feedResourceDAO = feedResourceDAO;
  }

  async getAsRecentlyViewed<T = {}>(
    override: OwnableQuery | undefined,
    pagination: Pagination,
    customQuery: { start_date?: string; end_date?: string } & T
  ) {
    const context = await this.userOwnableQuery.build(override);

    return this.feedResourceDAO.findAsRecentlyViewed(
      context,
      pagination,
      customQuery
    );
  }
}

class ContactFeedBiz extends FeedResourceBiz<'contact'> {
  constructor(opts: BizOpts) {
    super(opts.services.dao.contactFeed, opts);
  }
}
class DealFeedBiz extends FeedResourceBiz<'deal'> {
  constructor(opts: BizOpts) {
    super(opts.services.dao.dealFeed, opts);
  }

  async getAsRecentlyViewed(
    override: OwnableQuery | undefined,
    pagination: Pagination,
    query: Parameters<DealDAO['queryBuilder']>[1]
  ) {
    return super.getAsRecentlyViewed(override, pagination, query);
  }
}
class OrganizationFeedBiz extends FeedResourceBiz<'organization'> {
  constructor(opts: BizOpts) {
    super(opts.services.dao.organizationFeed, opts);
  }
}

export function feedResourceBizFactory<T extends Resources>(
  type: T,
  opts: BizOpts
) {
  if (type === 'contact') {
    return new ContactFeedBiz(opts) as FeedResourceBizFactory<T>;
  } else if (type === 'deal') {
    return new DealFeedBiz(opts) as FeedResourceBizFactory<T>;
  } else if (type === 'organization') {
    return new OrganizationFeedBiz(opts) as FeedResourceBizFactory<T>;
  }

  throw new Error('unknown type provided');
}
