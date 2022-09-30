import { NextFunction, Request, Response } from 'express';
import { ResponseMiddleware } from './types';

export function NotFoundWrapper(
  req: Request,
  res: Response & { error: any },
  next: NextFunction
) {
  return res.error(404, {
    error: 'Path not found',
  });
}

/**
 * Error wrapper, given a status code and payload, build the correct response.
 */
export function ErrorWrapper(
  req: Request,
  res: Response & ResponseMiddleware,
  next: NextFunction
) {
  (res.error as any) = async (status: number, data: any) => {
    res.status(status).json(data);
    return;
  };

  return next();
}
