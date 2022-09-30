import * as jwt from 'jsonwebtoken';
import { InvalidCredentials } from 'lib/middlewares/exception';

export type ResourceType = 'organization';

/**
 * Indicates the access a user has to a specific resource along with what action
 * they can perform on the resource. For now, we limit access to one resource
 * denoted by `id` per JWT
 */
export type ResourceAccess = {
  [T in ResourceType]: {
    id: string;
  }[];
};

export type Scope =
  | '' // the default deprecated 'profile' scope
  | 'profile'
  | 'impersonation'
  | 'invited'
  | 'password-reset'
  | 'guest';

// Keys that are added after signing a JWT
export type JWTBase = {
  iat: number;
  exp: number;
};

// Majority of JWT will be in this form
export type UserJWT<T extends Scope = 'profile'> = {
  scope: T; // TODO add this to default user jwt
  tenant_id: string;
  id: string; // user's id
};
// When a user impersonates another user
export type ImpersonateJWT<T extends Scope = 'impersonation'> = {
  scope: T;
  tenant_id: string;
  id: string; // user's id
  impersonator: string; // impersonation user id
};
// When a user has requested a password reset
export type ResetJWT<T extends Scope = 'password-reset'> = {
  scope: T;
  tenant_id: string;
  id: string; // user's id
  email: string;
};
// When a user has been invited
export type InvitedJWT<T extends Scope = 'invited'> = {
  scope: T;
  tenant_id: string;
  id: string;
  email: string;
};
// When a user has been given guest access to interact with an endpoint
export type GuestJWT<T extends Scope = 'guest'> = {
  scope: T;
  tenant_id: string;
  email: string;
  shared_by_id: string;
  contact_id: string; // must be a contact
  resource_access: ResourceAccess;
};

// All possible payloads, sometimes we don't need JWT related keys
export type JWTPayload =
  | UserJWT
  | ImpersonateJWT
  | ResetJWT
  | InvitedJWT
  | GuestJWT;

// The actual form of a fully signed JWT (when receiving a request or after signing)
export type JWTContext =
  | (UserJWT & JWTBase)
  | (ImpersonateJWT & JWTBase)
  | (ResetJWT & JWTBase)
  | (InvitedJWT & JWTBase)
  | (GuestJWT & JWTBase);

/**
 * Provides some helper functions for JWT related functions
 */
export class JWT {
  readonly secret: string;
  public token: string;
  public payload?: JWTContext;

  constructor(token = '') {
    this.secret = process.env.SECRET as string;
    this.token = token;
  }

  generate(
    payload: JWTPayload,
    opts: {
      expiresIn: string;
    }
  ) {
    this.token = jwt.sign(payload, this.secret, {
      expiresIn: opts.expiresIn,
    });
    ({ payload: this.payload } = this.extractContents());

    return this.token;
  }

  verify(
    ignoreExpired?: boolean // allow token verification but ignore expired error
  ) {
    if (!this.token) {
      throw new InvalidCredentials('No JWT provided');
    }

    this.requireValidFormat();

    try {
      this.payload = jwt.verify(this.token, this.secret) as JWTContext;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        if (!ignoreExpired) {
          throw new InvalidCredentials('Token expired.');
        }
        // ignoring expiration error, return payload
        ({ payload: this.payload } = this.extractContents());
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new InvalidCredentials('Token invalid.');
      } else {
        throw error;
      }
    }
  }

  private requireValidFormat() {
    if (!this.token) {
      throw new InvalidCredentials('No JWT provided');
    }

    const parts = this.token.split('.');

    // JWTs have the structure header.payload.signature
    if (parts.length !== 3) {
      throw new InvalidCredentials('JWT format is invalid');
    }

    // Check if all segments are base64 encoded
    try {
      Buffer.from(parts[0], 'base64');
      Buffer.from(parts[1], 'base64');
      Buffer.from(parts[2], 'base64');
    } catch (err) {
      throw new InvalidCredentials('JWT format is invalid');
    }

    // Check if the header and payload are valid JSON
    try {
      JSON.parse(Buffer.from(parts[0], 'base64').toString());
      JSON.parse(Buffer.from(parts[1], 'base64').toString());
    } catch {
      throw new InvalidCredentials('JWT format is invalid');
    }
  }

  private extractContents() {
    const parts = this.token.split('.');

    return {
      header: JSON.parse(Buffer.from(parts[0], 'base64').toString()),
      payload: JSON.parse(Buffer.from(parts[1], 'base64').toString()),
    };
  }
}
