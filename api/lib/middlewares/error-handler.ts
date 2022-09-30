import { ExpressErrorFn } from 'lib/types/express';
import { emitAsyncSafe } from './emitter';
import logger from '../logger';
import { Exception } from './exception';

// Note: keep all 4 parameters here. That's how Express recognizes it's the error handler, even if
// we don't use next
const errorHandler: ExpressErrorFn<Exception> = (err, req, res, next) => {
  let payload: any = {
    errors: [],
  };

  const errors = Array.isArray(err) ? err : [err];

  const isCustomException = (error: Error | Exception) =>
    error instanceof Exception;

  const allCustomExceptions = errors.every(isCustomException);

  if (!allCustomExceptions) {
    res.status(500);
  } else {
    const statuses = (errors as Exception[]).map(({ status }) => status);
    const uniqueStatuses = new Set(statuses);

    // If there's multiple different status codes in the errors, use 500
    let status = 500;
    if (uniqueStatuses.size === 1) {
      status = statuses[0];
    }

    res.status(status);
  }

  (errors as Exception[]).forEach((error) => {
    const isCustomError = isCustomException(error);
    let webError = error;
    if (!isCustomError) {
      webError = new req.exception.InternalServerError();
    }

    const formattedError = {
      message: webError.message,
      extensions: {
        code: webError.code,
      },
    };
    res.status(webError.status);

    if (isCustomError) {
      logger.debug(error);

      payload.errors.push(formattedError);
    } else {
      logger.error(error);

      payload = {
        errors: [formattedError],
      };
    }
  });

  emitAsyncSafe('error', payload.errors).then(() => {
    return res.json(payload);
  });
};

export default errorHandler;
