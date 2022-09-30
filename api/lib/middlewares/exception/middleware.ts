import { NextFunction, Request, Response } from 'express';
import {
  Exception,
  InvalidPayload,
  InvalidCredentials,
  InvalidOTP,
  UserSuspended,
  Forbidden,
  ResourceNotFound,
  RouteNotFound,
  Conflict,
  RequestEntityTooLarge,
  InternalServerError,
  ServiceUnavailable,
} from './exception';

export const exception = {
  Exception,
  InvalidPayload,
  InvalidCredentials,
  InvalidOTP,
  UserSuspended,
  Forbidden,
  Conflict,
  ResourceNotFound,
  RouteNotFound,
  RequestEntityTooLarge,
  InternalServerError,
  ServiceUnavailable,
};

export type ExceptionMiddleware = {
  exception: typeof exception;
};

export function ExceptionWrapper(
  req: Request & ExceptionMiddleware,
  res: Response,
  next: NextFunction
) {
  req.exception = exception;

  return next();
}
