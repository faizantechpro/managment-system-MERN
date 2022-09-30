/**
 * At a high level, we have three options when a user queries our resources.
 *
 * 1. If Admin, no tenant is provided, and no tenant is required, allow
 * querying by any tenant.
 * 2. If Admin and tenant provided, allow provided tenant to be used
 * 3. If Not Admin, use the user tenant
 *
 * This is implemented using Chain of Responsibility pattern.
 */

import { ownerDAOFactory, Resources } from 'lib/dao';
import { BizOpts } from './types';

// Queries that are based on context but require tenant id
export type RequiredTenantQuery = {
  tenantId: string;
};

// Queries that are based on context
export type TenantQuery = {
  tenantId?: string;
  self?: boolean; // TODO move this somewhere else.. only required on input
};

// Queries that are based on context and may require tenant id and optional
// user id (in case of admins)
export type UserQuery = TenantQuery & {
  userId?: string;
};

// Queries that also evaluated owned ids as an optional filter.
export type OwnableQuery = UserQuery & {
  ownedIds?: string[];
};

export abstract class ContextQueryHandler<T extends UserQuery> {
  protected services: BizOpts['services'];
  protected user: BizOpts['user'];
  private next: ContextQueryHandler<T> | null;

  constructor(opts: Omit<BizOpts, 'exception'>) {
    this.services = opts.services;
    this.user = opts.user;
    this.next = null;
  }

  setNext(handler: ContextQueryHandler<T>) {
    this.next = handler;
    return handler;
  }

  /**
   * Overrides should be partial as it will either be a tenant override
   * or a user override which will require tenant to be set after the user
   * is set.
   *
   * And if it's a self override, both tenant and user is set.
   */
  async build(override?: Partial<T>): Promise<T> {
    if (override) {
      if (override.self) {
        // the typecase MAY become unsafe at some point...
        // for now, only tenantId is every possibly required so the cast
        // is fine in terms of a self override
        return {
          tenantId: this.user.tenant,
          userId: this.user.id,
        } as T;
      }

      // TODO allow overriding userId
    }

    return this.contextBuild(override);
  }

  async contextBuild(override?: Partial<T>): Promise<T> {
    if (!this.next) {
      throw new Error('Unable to fetch context');
    }

    return this.next.contextBuild(override);
  }
}

/**
 * This is required in situations where a tenant does not have to be provided.
 * As admins can query all data, return an empty context for filtering,
 * otherwise move on to next handler as admin would like to query by tenant or
 * user.
 */
export class Admin extends ContextQueryHandler<TenantQuery> {
  async contextBuild(override?: TenantQuery) {
    if (!this.user.auth.isAdmin) {
      return super.contextBuild(override);
    }
    if (override?.tenantId) {
      return {
        tenantId: override.tenantId,
      };
    }
    return {};
  }
}

/**
 * This is required for situations where a tenant has to be provided. As admins
 * can access any tenant, they are free to select any tenant but if not provided,
 * we need to move onto the next handler.
 *
 * Example: creating a new record requires a tenant id.
 */
export class AdminTenant extends ContextQueryHandler<RequiredTenantQuery> {
  async contextBuild(override?: Partial<RequiredTenantQuery>) {
    if (!this.user.auth.isAdmin) {
      return super.contextBuild(override);
    }

    return {
      tenantId: override?.tenantId ? override.tenantId : this.user.tenant,
    };
  }
}

/**
 * Restrict queries by the user's tenant.
 */
export class Tenant extends ContextQueryHandler<RequiredTenantQuery> {
  async contextBuild() {
    return {
      tenantId: this.user.tenant,
    };
  }
}

/**
 * The default builder which will just set context to the user's
 * context.
 */
export class User extends ContextQueryHandler<UserQuery> {
  async contextBuild() {
    return {
      tenantId: this.user.tenant,
      userId: this.user.id,
    };
  }
}

/**
 * Similar to User but also allows for filtering by owned ids.
 */
export class Ownable<
  T extends Resources
> extends ContextQueryHandler<OwnableQuery> {
  protected ownerDAO: ReturnType<typeof ownerDAOFactory>;

  constructor(
    type: T,
    ...args: ConstructorParameters<typeof ContextQueryHandler>
  ) {
    super(...args);

    this.ownerDAO =
      type === 'contact'
        ? this.services.dao.contactOwner
        : type === 'deal'
        ? this.services.dao.dealOwner
        : this.services.dao.organizationOwner;
  }

  async contextBuild() {
    const ownedIds = await this.ownerDAO.findAllAsResourceIds({
      userId: this.user.id,
    });
    return {
      tenantId: this.user.tenant,
      // when searching by what a user owns, it can be direct ownership through
      // assigned_user_id or by created_id. This will be set as an OR query:
      // tenant_id: '123' AND ( created_by_id; '123' OR owned_ids: '123' )
      userId: this.user.id,
      ownedIds: ownedIds,
    };
  }
}
