// dist/ path is required, library doesn't export to root...
import { ValidationError } from 'express-openapi-validator/dist/framework/types';
import { NextFunction, Request, Response } from 'express';

/**
 * Parses a validation error to JSON as default is HTML
 */
export function openAPIErrorMiddleware(
  err: Error & ValidationError,
  req: Request & { exception: { Exception: any } },
  res: Response,
  next: NextFunction
) {
  // filter out a possible non related validation error
  if (!('status' in err) && !('errors' in err)) {
    return next(err);
  }

  // schema shouldn't be generating non 400 errors, let another mw handle
  if (err.status !== 400 || err instanceof req.exception.Exception) {
    return next(err);
  }

  return res.status(err.status).json({
    error: 'Bad Request',
    errors: err.errors,
  });
}
