import { JWTContext } from 'lib/services';

/**
 * Contains the authenticated context when a route uses authenticate middleware
 */
export type AuthUser = {
  id: string;
  tenant: string;
  jwt: JWTContext;
  auth: {
    isAdmin: boolean; // able to query across all tenants
    isOwner: boolean; // able to query an entire tenant
    isGuest: boolean; // restricted by organization id
  };

  /**
   * @deprecated TODO move usage into `auth` (key TBD)
   */
  roles: string;
  /**
   * @deprecated TODO move usage into auth.isOwner
   */
  owner: boolean;
  /**
   * @deprecated TODO move usage into auth.isAdmin
   */
  admin: boolean;
};

export type AuthMiddleware = {
  user: AuthUser;
};
