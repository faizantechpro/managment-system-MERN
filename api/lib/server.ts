import * as http from 'http';
import createApp from './app';
import { openTelemetryRequest } from './middlewares/opentelemetry';
import { ResponseRequest } from './middlewares/response';
import { terminusMiddleware } from './middlewares/terminus';
import { operationRequest } from './utils';

export default async function createServer(): Promise<http.Server> {
  const appInstance = await createApp();

  const server = http.createServer(appInstance);

  server
    .on('request', ResponseRequest(server))
    .on('request', operationRequest)
    .on('request', openTelemetryRequest);

  terminusMiddleware(server, {
    directus: {
      isDev: 'DIRECTUS_DEV' in process.env,
    },
  });

  return server;
}
