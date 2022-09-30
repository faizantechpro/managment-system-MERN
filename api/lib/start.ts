import 'module-alias/register';
// needed for sentry
(global as any).__rootdir__ = __dirname || process.cwd();

import * as dotenv from 'dotenv';
import logger from './logger';
import path from 'path';

// load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// these are required to be imported AFTER dotenv is loaded
import { emitter, emitAsyncSafe } from './middlewares/emitter';
import { sequelizeInit } from './middlewares/sequelize';
import * as database from './database';
import * as mailer from './mailer';
import * as storage from './storage';

if (require.main === module) {
  start();
}

async function start(): Promise<void> {
  // manually initialize exported objects
  mailer.init({
    transport: process.env.EMAIL_TRANSPORT as any,
    sendmail: {
      newline: process.env.EMAIL_SENDMAIL_NEW_LINE,
      path: process.env.EMAIL_SENDMAIL_PATH,
    },
    smtp: {
      host: process.env.EMAIL_SMTP_HOST,
      port: process.env.EMAIL_SMTP_PORT,
      pool: process.env.EMAIL_SMTP_POOL,
      secure: process.env.EMAIL_SMTP_SECURE,
      user: process.env.EMAIL_SMTP_USER,
      pass: process.env.EMAIL_SMTP_PASSWORD,
    },
    mailgun: {
      key: process.env.EMAIL_MAILGUN_API_KEY,
      domain: process.env.EMAIL_MAILGUN_DOMAIN,
    },
  });
  storage.init();
  await database.init();
  await sequelizeInit({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    database: process.env.DB_DATABASE || 'idf',
    schema: 'public',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    sync: process.env.DB_SYNC === 'true',
  });

  const createServer = require('./server').default;
  const server = await createServer();
  // todo revisit this...
  require('./middlewares/emitter/tasks/notifier');

  await emitter.emitAsync('server.start.before', { server });

  const port = process.env.PORT || 8080;

  server
    .listen(port, () => {
      logger.info(`Server started at port ${port}`);
      emitAsyncSafe('server.start');
    })
    .once('error', (err: any) => {
      if (err?.code === 'EADDRINUSE') {
        logger.error(`Port ${port} is already in use`);
        process.exit(1);
      } else {
        throw err;
      }
    });
}
