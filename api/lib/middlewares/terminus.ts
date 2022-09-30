import * as http from 'http';
import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import { emitAsyncSafe } from 'lib/middlewares/emitter';
import logger from 'lib/logger';

export function terminusMiddleware(
  app: http.Server,
  opts: {
    directus: {
      isDev: boolean;
    };
  }
) {
  const terminusOptions: TerminusOptions = {
    timeout: 1000,
    signals: ['SIGINT', 'SIGTERM', 'SIGHUP'],
    beforeShutdown,
    onSignal,
    onShutdown,
  };
  createTerminus(app, terminusOptions);

  async function beforeShutdown() {
    emitAsyncSafe('server.stop.before', { server: app });

    if (opts.directus.isDev) {
      logger.info('Restarting...');
    } else {
      logger.info('Shutting down...');
    }
  }

  async function onSignal() {
    logger.info('Database connections destroyed');
  }

  async function onShutdown() {
    emitAsyncSafe('server.stop');

    if (!opts.directus.isDev) {
      logger.info('Directus shut down OK. Bye bye!');
    }
  }
}
