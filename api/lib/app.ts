import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import expressLogger from 'express-pino-logger';
import fs from 'fs';
import path from 'path';
import qs from 'qs';

import logger from './logger';

// middlewares
import { authenticateMiddleware } from './middlewares/auth';
import { servicesMiddleware } from './middlewares/context';
import { initCubejs } from './middlewares/cubejs';
import errorHandler from './middlewares/error-handler';
import {
  ExceptionWrapper,
  RequestEntityTooLarge,
} from './middlewares/exception';
import {
  openAPIErrorMiddleware,
  openAPIMiddleware,
} from './middlewares/openapi';
import {
  openTelemetryError,
  openTelemetryMiddleware,
} from './middlewares/opentelemetry';
import { responseMiddleware } from './middlewares/response';
import { unlessMiddleware } from './middlewares/unless';
import { emitterMiddleware } from './middlewares/emitter';

//controllers
import roles from './controllers/roles';
import reports from './controllers/report';
import lessons from './controllers/lessons';
import categories from './controllers/categories';
import authController from './controllers/auth';
import users from './controllers/users';
import assets from './controllers/assets';
import files from './controllers/files';
import feed from './controllers/feed';
import contact from './controllers/contacts';
import quizzes from './controllers/quiz';
import courses from './controllers/courses';
import deals from './controllers/deals';
import products from './controllers/products';
import search from './controllers/search';
import stages from './controllers/stages';
import relatedOrganization from './controllers/relatedOrganization';
import activityContacts from './controllers/activity';
import { TenantService } from './services/tenant';
import { sequelizeMiddleware } from './middlewares/sequelize';

const pkg = require('../package.json');

export default async function createApp() {
  const app = express();

  app.set('trust proxy', true);
  app.set('query parser', (str: string) => qs.parse(str, { depth: 10 }));

  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS || '*',
    })
  );

  app.disable('x-powered-by');
  app.use(function PoweredBy(req, res, next) {
    res.setHeader('X-Powered-By', 'HelloTica');
    next();
  });

  openTelemetryMiddleware(app, pkg, {
    prometheusPort: 9464, // unused for now
    env: process.env.NODE_ENV || 'production',
    enabled: process.env.TRACING_ENABLE === 'true',
    consoleEnabled: process.env.TRACING_ENABLE_CONSOLE === 'true',
    sentryHost: process.env.TRACING_SENTRY_DSN,
    zipkinHost: process.env.TRACING_ZIPKIN_HOST,
  });
  responseMiddleware(app);
  app.use(ExceptionWrapper as any);
  emitterMiddleware(app);
  sequelizeMiddleware(app);

  // setup logger
  const expressLoggerMiddleware = expressLogger({ logger });
  Object.defineProperty(expressLoggerMiddleware, 'name', {
    value: 'expressLoggerMiddleware',
    configurable: true,
  });
  app.use(expressLoggerMiddleware);

  app.use(function BodyParser(req, res, next) {
    bodyParser.json({
      limit: process.env.MAX_PAYLOAD_SIZE || '3000kb',
    })(req, res, (err) => {
      if (err) {
        return next(new RequestEntityTooLarge(err.message));
      }

      return next();
    });
  });

  // keepalive pod/load balancer status
  app.use('/status', (req, res, next) => res.status(200).send());
  app.use('/api/status', (req, res, next) => res.status(200).send());

  app.get('/env', async (req, res) => {
    const host = req.headers.host || 'localhost';
    const tenant = await TenantService.getTenantBySubdomain(host);

    if (!tenant) {
      return res.status(404).send();
    }

    res.json(tenant);
  });

  // main routes
  const isNonProdEnv = ['local', 'dev', 'staging'].some((env) =>
    process.env.NODE_ENV?.startsWith(env)
  );
  const apiPath = '/api';

  // this is only needed for openapi compatibility with old controller setup
  const defaultNonAuthRoutes = [
    '/auth/login',
    '/auth/logout',
    '/auth/password/request',
    '/auth/token/introspect',
    '/auth/guest/token',
    '/tenants/subdomains',
    '/avatars',
  ];

  const authenticateMW = authenticateMiddleware({
    jwtSecret: process.env.SECRET!,
    basicUser: process.env.BASIC_USER!,
    basicPass: process.env.BASIC_PASSWORD!,
  });
  // no need to run authn on swagger docs or /auth
  isNonProdEnv || process.env.API_DOCS === 'true'
    ? app.use(
        apiPath,
        unlessMiddleware(
          authenticateMW,
          '/swagger.json',
          '/docs',
          ...defaultNonAuthRoutes
        )
      )
    : app.use(
        apiPath,
        unlessMiddleware(authenticateMW, ...defaultNonAuthRoutes)
      );
  app.use(servicesMiddleware as any);

  app.use('/api', authController); // authn mw removed
  app.use('/api', roles);
  app.use('/api', reports);
  app.use('/api', users);
  app.use('/api', lessons);
  app.use('/api', categories);
  app.use('/api', files);
  app.use('/api/assets', assets);
  app.use('/api', feed);
  app.use('/api', contact);
  app.use('/api', quizzes);
  app.use('/api', courses);
  app.use('/api', deals);
  app.use('/api', products);
  app.use('/api', search);
  app.use('/api', stages);
  app.use('/api', relatedOrganization);
  app.use('/api', activityContacts);

  openAPIMiddleware(app, apiPath, pkg, {
    enableGlob: process.env.OPENAPI_TS === 'true',
    exposeAPIDocs: isNonProdEnv || process.env.API_DOCS === 'true',
    exposeAPIDocsUI: isNonProdEnv || process.env.API_DOCS === 'true',
  });

  // has to be before cubejs since cubejs has its own error middleware that
  // cannot be disabled...
  app.use(openTelemetryError as any);
  app.use(openAPIErrorMiddleware as any);
  app.use(errorHandler as any);

  initCubejs(app, {
    apiSecret: process.env.SECRET,
    db: {
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
  });

  if (process.env.NODE_ENV === 'production') {
    const portalPath = path.resolve(__dirname, '../../build/index.html');
    const publicUrl = process.env.PUBLIC_URL || '';

    // Prefix all href/src in the index html with the APIs public path
    let html = fs.readFileSync(portalPath, 'utf-8');
    html = html.replace(/href="\//g, `href="${publicUrl}/`);
    html = html.replace(/src="\//g, `src="${publicUrl}/`);

    app.get('/', (req, res) => res.send(html));
    app.use('/', express.static(path.join(portalPath, '..')));
    app.use('/*', function HTML(req, res) {
      res.send(html);
    });
  }

  return app;
}
