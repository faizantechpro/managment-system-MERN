import {
  Admin,
  AdminTenant,
  TenantQuery,
  ContextQueryHandler,
  Tenant,
  RequiredTenantQuery,
  Ownable,
  OwnableQuery,
  User,
  UserQuery,
} from './ContextQuery';
import { BizOpts } from './types';

/**
 * Allows restrictions based on the user context.
 *
 * We want to restrict this on the Biz layer level, not the DAO layer
 * as DAO should be free to query however we wish.
 */
export class Context {
  protected services: BizOpts['services'];
  protected user: BizOpts['user'];

  // allows querying without tenant
  public query: ContextQueryHandler<TenantQuery>;

  // requires tenant usage but admins can query by any tenant
  public tenantQuery: ContextQueryHandler<RequiredTenantQuery>;

  // allows querying without tenant, or owner's tenant, or by user's id
  public userQuery: ContextQueryHandler<UserQuery>;

  // this is to query with ownable ids
  public userContactQuery: ContextQueryHandler<OwnableQuery>;
  public userDealQuery: ContextQueryHandler<OwnableQuery>;
  public userOrganizationQuery: ContextQueryHandler<OwnableQuery>;
  public userOwnableQuery: ContextQueryHandler<OwnableQuery>;

  constructor(biz: Omit<BizOpts, 'exception'>) {
    this.services = biz.services;
    this.user = biz.user;

    const noRestrictionBuilder = new Admin(biz);
    noRestrictionBuilder.setNext(new AdminTenant(biz)).setNext(new Tenant(biz));
    this.query = noRestrictionBuilder;

    const tenantBuilder = new AdminTenant(biz);
    tenantBuilder.setNext(new Tenant(biz));
    this.tenantQuery = tenantBuilder;

    const userBuilder = new Admin(biz);
    userBuilder
      .setNext(new AdminTenant(biz))
      .setNext(new Tenant(biz))
      .setNext(new User(biz));
    this.userQuery = userBuilder;

    const userContactBuilder = new Admin(biz);
    userContactBuilder
      .setNext(new AdminTenant(biz))
      .setNext(new Tenant(biz))
      .setNext(new Ownable('contact', biz));
    this.userContactQuery = userContactBuilder;

    const userDealBuilder = new Admin(biz);
    userDealBuilder
      .setNext(new AdminTenant(biz))
      .setNext(new Tenant(biz))
      .setNext(new Ownable('deal', biz));
    this.userDealQuery = userDealBuilder;

    const userOrganizationBuilder = new Admin(biz);
    userOrganizationBuilder
      .setNext(new AdminTenant(biz))
      .setNext(new Tenant(biz))
      .setNext(new Ownable('deal', biz));
    this.userOrganizationQuery = userOrganizationBuilder;

    let userOwnableQuery: ContextQueryHandler<OwnableQuery>;
    if (biz.type === 'contact') {
      userOwnableQuery = new Ownable('contact', biz);
    } else if (biz.type === 'deal') {
      userOwnableQuery = new Ownable('deal', biz);
    } else if (biz.type === 'organization') {
      userOwnableQuery = new Ownable('organization', biz);
    } else {
      userOwnableQuery = new User(biz);
    }
    const userOwnableBuilder = new Admin(biz);
    userOwnableBuilder
      .setNext(new AdminTenant(biz))
      .setNext(new Tenant(biz))
      .setNext(userOwnableQuery);
    this.userOwnableQuery = userOwnableBuilder;
  }
}
