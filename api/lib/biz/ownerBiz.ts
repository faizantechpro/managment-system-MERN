import { OwnerDAOFactory, Pagination, Resources } from 'lib/dao';
import { Biz, BizOpts } from './utils';
import { UserQuery } from './utils/ContextQuery';

export type OwnerBizFactory<T extends Resources> = T extends 'contact'
  ? ContactOwnerBiz
  : T extends 'deal'
  ? DealOwnerBiz
  : T extends 'organization'
  ? OrganizationOwnerBiz
  : never;

abstract class OwnerBiz<T extends Resources> extends Biz {
  protected ownerDAO: OwnerDAOFactory<T>['dao'];

  constructor(
    ownerDAO: OwnerDAOFactory<T>['dao'],
    ...args: ConstructorParameters<typeof Biz>
  ) {
    super(...args);

    this.ownerDAO = ownerDAO;
  }

  public async getByParent(
    override: UserQuery | undefined,
    pagination: Pagination
  ) {
    const context = await this.userQuery.build(override);

    return this.ownerDAO.findByParent(context, pagination);
  }
}

class ContactOwnerBiz extends OwnerBiz<'contact'> {
  constructor(opts: BizOpts) {
    super(opts.services.dao.contactOwner, opts);
  }
}
class DealOwnerBiz extends OwnerBiz<'deal'> {
  constructor(opts: BizOpts) {
    super(opts.services.dao.dealOwner, opts);
  }
}
class OrganizationOwnerBiz extends OwnerBiz<'organization'> {
  constructor(opts: BizOpts) {
    super(opts.services.dao.organizationOwner, opts);
  }
}

export function ownerBizFactory<T extends Resources>(type: T, opts: BizOpts) {
  if (type === 'contact') {
    return new ContactOwnerBiz(opts) as OwnerBizFactory<T>;
  } else if (type === 'deal') {
    return new DealOwnerBiz(opts) as OwnerBizFactory<T>;
  } else if (type === 'organization') {
    return new OrganizationOwnerBiz(opts) as OwnerBizFactory<T>;
  }

  throw new Error('unknown type provided');
}
