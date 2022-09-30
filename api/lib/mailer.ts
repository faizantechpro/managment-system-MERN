import nodemailer, { Transporter } from 'nodemailer';
import logger from './logger';

export let transporter: Transporter;

export function init(opts: {
  transport: 'sendmail' | 'smtp' | 'mailgun';
  sendmail: {
    newline?: string;
    path?: string;
  };
  smtp: {
    pool?: string;
    host?: string;
    port?: string;
    secure?: string;
    user?: string;
    pass?: string;
  };
  mailgun: {
    key?: string;
    domain?: string;
  };
}) {
  if (opts.transport.toLowerCase() === 'sendmail') {
    transporter = nodemailer.createTransport({
      sendmail: true,
      newline: opts.sendmail.newline || 'unix',
      path: opts.sendmail.path || '/usr/sbin/sendmail',
    });
  } else if (opts.transport.toLowerCase() === 'smtp') {
    let auth: boolean | { user?: string; pass?: string } = false;

    if (opts.smtp.user || opts.smtp.pass) {
      auth = {
        user: opts.smtp.user,
        pass: opts.smtp.pass,
      };
    }

    transporter = nodemailer.createTransport({
      pool: opts.smtp.pool,
      host: opts.smtp.host,
      port: opts.smtp.port,
      secure: opts.smtp.secure,
      auth: auth,
    } as Record<string, unknown>);
  } else if (opts.transport === 'mailgun') {
    const mg = require('nodemailer-mailgun-transport');

    transporter = nodemailer.createTransport(
      mg({
        auth: {
          api_key: opts.mailgun.key,
          domain: opts.mailgun.domain,
        },
      })
    );
  } else {
    logger.warn(
      'Illegal transport given for email. Check the EMAIL_TRANSPORT env var.'
    );
  }

  if (transporter) {
    transporter.verify((error) => {
      if (error) {
        logger.warn(`Couldn't connect to email server.`);
        logger.warn(`Email verification error: ${error}`);
      } else {
        logger.info(`Email connection established`);
      }
    });
  }
}
