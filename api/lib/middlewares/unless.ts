import { SpanStatusCode } from '@opentelemetry/api';
import { Request, RequestHandler } from 'express';
import { ExpressRequestFn } from 'lib/types/express';
import { OpenTelemetryTracingMiddleware } from './opentelemetry';

/**
 * Run middleware except on provided route(s)
 *
 * TODO find a better way, this feels odd.. (regex method is way is too messy)
 */
export function unlessMiddleware(
  middleware: ExpressRequestFn,
  ...paths: string[]
) {
  return async function unless(req, res, next) {
    if (
      paths.includes(req.path) || // equality check for base route
      paths.some((path) => req.path.startsWith(`${path}/`)) // in case base route extends
    ) {
      return next();
    } else {
      const newReq = req as Request & OpenTelemetryTracingMiddleware;

      // unable to set middleware - unless as parent span..
      await newReq.telemetry.tracer.startActiveSpan(
        `middleware (unless) - ${middleware.name}`,
        {
          kind: newReq.telemetry.sdk.SpanKind.INTERNAL,
        },
        async (span) => {
          span.setStatus({
            code: SpanStatusCode.OK,
          });

          try {
            await middleware(req as any, res, (error) => {
              if (error) {
                span.setStatus({
                  code: SpanStatusCode.ERROR,
                });
                span.setAttribute('error', true);
              }

              span.end();
              return next(error);
            });
          } catch (error: any) {
            span.setStatus({
              code: SpanStatusCode.ERROR,
            });
            span.setAttribute('error', true);
            span.end();
            return next(error);
          }
        }
      );
    }
  } as RequestHandler;
}
