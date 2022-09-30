import { SpanStatusCode } from '@opentelemetry/api';
import { ErrorRequestHandler, Request, RequestHandler } from 'express';
import { OpenTelemetryTracingMiddleware } from 'lib/middlewares/opentelemetry';

/**
 * Handles promises in routes and route errors accordingly
 */
function asyncHandler(handler: RequestHandler): RequestHandler;
function asyncHandler(handler: ErrorRequestHandler): ErrorRequestHandler;
function asyncHandler(
  handler: RequestHandler | ErrorRequestHandler
): RequestHandler | ErrorRequestHandler {
  if (handler.length === 2 || handler.length === 3) {
    const scoped: RequestHandler = (req, res, next) => {
      const newReq = req as Request & OpenTelemetryTracingMiddleware;
      return newReq.telemetry.tracer.startActiveSpan(
        `AsyncHandler - ${req.path}`,
        {
          kind: newReq.telemetry.sdk.SpanKind.INTERNAL,
        },
        async (span) => {
          span.setStatus({
            code: SpanStatusCode.OK,
          });

          return Promise.resolve((handler as RequestHandler)(req, res, next))
            .then(() => span.end())
            .catch((error) => {
              span.setStatus({
                code: SpanStatusCode.ERROR,
              });
              span.setAttribute('error', true);
              span.end();
              return next(error);
            });
        }
      );
    };
    return scoped;
  } else if (handler.length === 4) {
    const scoped: ErrorRequestHandler = (err, req, res, next) => {
      const newReq = req as Request & OpenTelemetryTracingMiddleware;
      return newReq.telemetry.tracer.startActiveSpan(
        `AsyncHandler - ${req.path}`,
        {
          kind: newReq.telemetry.sdk.SpanKind.INTERNAL,
        },
        async (span) => {
          span.setStatus({
            code: SpanStatusCode.OK,
          });

          return Promise.resolve(
            (handler as ErrorRequestHandler)(err, req, res, next)
          )
            .then(() => span.end())
            .catch((error) => {
              span.setStatus({
                code: SpanStatusCode.ERROR,
              });
              span.setAttribute('error', true);
              span.end();
              return next(error);
            });
        }
      );
    };
    return scoped;
  } else {
    throw new Error(`Failed to asyncHandle() function "${handler.name}"`);
  }
}

export default asyncHandler;
