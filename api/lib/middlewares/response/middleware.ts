import { Express, Response } from 'express';
import * as http from 'http';
import * as https from 'https';
import { emitAsyncSafe } from 'lib/middlewares/emitter';
import { APIRequest } from 'lib/utils';
import { once } from 'lodash';
import qs from 'qs';
import url from 'url';
import { ErrorWrapper } from './error';
import { SuccessWrapper } from './success';

export function responseMiddleware(app: Express) {
  app.use(SuccessWrapper as any);
  app.use(ErrorWrapper as any);
}

export function ResponseRequest(app: http.Server) {
  return function responseRequest(req: APIRequest, res: Response) {
    const startTime = process.hrtime();

    const complete = once(function (finished: boolean) {
      const elapsedTime = process.hrtime(startTime);
      const elapsedNanoseconds = elapsedTime[0] * 1e9 + elapsedTime[1];
      const elapsedMilliseconds = elapsedNanoseconds / 1e6;

      const previousIn = (req.socket as any)._metrics?.in || 0;
      const previousOut = (req.socket as any)._metrics?.out || 0;

      const metrics = {
        in: req.socket.bytesRead - previousIn,
        out: req.socket.bytesWritten - previousOut,
      };

      (req.socket as any)._metrics = {
        in: req.socket.bytesRead,
        out: req.socket.bytesWritten,
      };

      // Compatibility when supporting serving with certificates
      const protocol = app instanceof https.Server ? 'https' : 'http';

      // Rely on url.parse for path extraction
      // Doesn't break on illegal URLs
      const urlInfo = url.parse(req.originalUrl || req.url);

      const info = {
        finished,
        request: {
          aborted: req.aborted,
          completed: req.complete,
          method: req.method,
          url: urlInfo.href,
          path: urlInfo.pathname,
          protocol,
          host: req.headers.host,
          size: metrics.in,
          query: urlInfo.query ? qs.parse(urlInfo.query) : {},
          headers: req.headers,
        },
        response: {
          status: res.statusCode,
          size: metrics.out,
          headers: res.getHeaders(),
        },
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
        duration: elapsedMilliseconds.toFixed(),
      };

      emitAsyncSafe('response', info);
    });

    res.once('finish', complete.bind(null, true));
    res.once('close', complete.bind(null, false));
  };
}
