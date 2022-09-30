import { EventEmitter2 } from 'eventemitter2';
import { Express, NextFunction, Request, Response } from 'express';
import logger from 'lib/logger';
import { initSubscriptions } from './subscriptions';
import { EventName, EventTask } from './types';

export const emitter = new EventEmitter2({
  wildcard: true,
  verboseMemoryLeak: true,
  delimiter: '.',

  // This will ignore the "unspecified event" error
  ignoreErrors: true,
});

export type EmitterMiddleware = {
  emitter: EventEmitter2 & {
    emitAsyncSafe: typeof emitAsyncSafe;
    emitAppEvent: typeof emitAppEvent;
  };
};

export function emitterMiddleware(app: Express) {
  initSubscriptions(emitter);

  app.use(emitterMW as any);
}

export function emitterMW(
  req: Request & EmitterMiddleware,
  res: Response,
  next: NextFunction
) {
  req.emitter = emitter as any;
  req.emitter.emitAsyncSafe = emitAsyncSafe;
  req.emitter.emitAppEvent = emitAppEvent;

  return next();
}

/**
 * Emit async events without throwing errors. Just log them out as warnings.
 */
export async function emitAsyncSafe(name: string, ...args: any[]) {
  try {
    await emitter.emitAsync(name, ...args);
  } catch (err: any) {
    logger.warn(`An error was thrown while executing hook "${name}"`);
    logger.warn(err);
  }
}

export async function emitAppEvent<T extends EventName>(task: EventTask<T>) {
  try {
    await emitter.emitAsync('app.events', task);
  } catch (error) {
    logger.warn(`An error was thrown while executing hook "app.events"`);
    logger.warn(error);
  }
}
