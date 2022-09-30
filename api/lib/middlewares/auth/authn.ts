import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { userServiceFactory } from 'lib/services';
import isJWT from 'lib/middlewares/auth/isJWT';
import { InternalServerError, InvalidCredentials } from '../exception';
import { AuthMiddleware } from './types';

let opts: {
  jwtSecret: string;
  basicUser: string;
  basicPass: string;
};

export function authenticateMiddleware(authOpts: typeof opts) {
  opts = authOpts;

  return async function reqAuthenticate(
    req: Omit<Request, 'user'> & AuthMiddleware,
    res: Response,
    next: NextFunction
  ) {
    try {
      await authenticate(req);
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export async function authenticate(
  req: Omit<Request, 'user'> & AuthMiddleware
) {
  let token: string | null = null;
  let payload: any | null = null;

  req.user = {
    id: null,
    tenant: null,
    roles: null,
    admin: false,
    owner: false,
    auth: {
      isAdmin: false,
      isOwner: false,
      isGuest: false,
    },
  } as any;

  // yes it's set right above..., it's just for typing
  if (!req.user) {
    throw new InternalServerError();
  }

  if (req.query && req.query.access_token) {
    token = req.query.access_token as string;
  }

  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    } else if (parts.length === 2 && parts[0] === 'Basic') {
      const credentials = Buffer.from(parts[1], 'base64').toString('ascii');
      const [user, password] = credentials.split(':');

      if (user === opts.basicUser && password === opts.basicPass) {
        req.user.admin = true;
        req.user.auth.isAdmin = true;

        return;
      }
    }
  }

  if (!token) {
    throw new InvalidCredentials('No JWT Provided');
  }

  if (!isJWT(token)) {
    throw new InvalidCredentials('JWT format is invalid');
  }

  try {
    payload = jwt.verify(token, opts.jwtSecret as string);
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new InvalidCredentials('Token expired.');
    } else if (err instanceof JsonWebTokenError) {
      throw new InvalidCredentials('Token invalid.');
    } else {
      throw err;
    }
  }

  (req as any).jwt = payload;
  req.user.jwt = payload;

  if ('tenant_id' in req.user.jwt) {
    req.user.tenant = req.user.jwt.tenant_id;
  }
  const isGuest = req.user.jwt.scope === 'guest';
  if (isGuest) {
    req.user.auth.isGuest = true;
    return;
  }

  req.user.id = payload.id;

  const service = userServiceFactory({
    id: req.user.id,
    auth: { isAdmin: true },
  } as any);

  const user = JSON.parse(JSON.stringify(await service.getUser(req.user.id)));

  if (user?.roleInfo) {
    req.user.roles = user.roleInfo.id;
    req.user.admin = user.roleInfo.admin_access;
    req.user.owner = user.roleInfo.owner_access;

    req.user.auth.isAdmin = req.user.admin;
    req.user.auth.isOwner = req.user.owner;
  }

  // for cubejs
  (req as any).securityContext = {
    user: req.user,
    exception: (req as any).exception,
    db: (req as any).db,
  };

  return;
}
