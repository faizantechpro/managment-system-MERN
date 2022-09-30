import { NextFunction, Request, Response } from 'express';
import { ResponseMiddleware } from './types';

/**
 * Adds `success` function to the Express response object and by default, it assumes
 * the status code should be 200. If a code is provided as the first arg, then use
 * that and second arg must be payload.
 */
export function SuccessWrapper(
  req: Request,
  res: Response & ResponseMiddleware,
  next: NextFunction
) {
  res.success = async (...args: [any] | [number, any]) => {
    let status = 200;
    let data = args[0];

    if (args.length === 2) {
      status = args[0];
      data = args[1];
    }
    res.status(status).json(data);
    return;
  };
  return next();
}
