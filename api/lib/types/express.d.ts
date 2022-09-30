/**
 * Custom properties on the req object in express
 */

import { Response, NextFunction, Request } from 'express';
import { AuthUser } from 'lib/middlewares/auth';
import { APIRequest } from 'lib/utils';

export {};

declare global {
  namespace Express {
    // only required for non openapi /api/controllers
    export interface Request {
      user: AuthUser;
    }
  }
}

/**
 * Generic Express error function to be implemented by middleware which can
 * optionally provided a custom error type.
 */
export type ExpressErrorFn<T = undefined> = (
  err: T extends undefined ? Error : Error | T,
  req: APIRequest,
  res: Response,
  next: NextFunction
) => void | Response;

export type ExpressRequestFn<T = undefined> = (
  req: T extends undefined ? Request : Request & T,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>> | void;
