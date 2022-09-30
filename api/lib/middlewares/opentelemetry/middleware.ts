import { Span, SpanKind, SpanStatusCode, Tracer } from '@opentelemetry/api';
import { api } from '@opentelemetry/sdk-node';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import * as Sentry from '@sentry/node';
import { Express, NextFunction, Request, Response } from 'express';
import { initializeTracer } from './tracing';

export type OpenTelemetryTracingMiddleware = {
  telemetry: {
    sdk: typeof api;
    /**
     * This should rarely be used as startActiveSpan starts child spans. The
     * few cases this is used is when parent span must be modified due to discovering
     * additional context that applies to the parent
     * e.g.: incoming request is an OpenAPI request, rename to OpenAPI operation
     */
    rootSpan: Span;
    sentry: typeof Sentry;
    tracer: Tracer;
  };
};

export function openTelemetryMiddleware(
  app: Express,
  pkg: { name: string; version: string; description: string },
  opts: {
    prometheusPort: number;
    env: string;
    enabled: boolean;
    consoleEnabled: boolean;
    sentryHost?: string;
    zipkinHost?: string;
  }
) {
  const tracer = initializeTracer(pkg.name, opts.env, opts);

  app.use(OpenTelemetryTracing(tracer) as any);

  const span = tracer.startSpan(`bootup`, {
    kind: SpanKind.INTERNAL,
  });
  span.addEvent('opentelemetry initialized, beginning boot up');
  return {
    sdk: api,
    span: span,
  };
}

export function OpenTelemetryTracing(tracer: Tracer) {
  return function openTelemetryTracing(
    req: Request & OpenTelemetryTracingMiddleware,
    res: Response,
    next: NextFunction
  ) {
    const span = api.trace.getSpan(api.context.active());

    const spanName = `${req.method} ${req.baseUrl}${req.path}`;
    if (!span) {
      return tracer.startActiveSpan(
        spanName,
        {
          attributes: {
            [SemanticAttributes.HTTP_METHOD]: req.method,
            [SemanticAttributes.HTTP_URL]: req.url,
          },
          kind: SpanKind.SERVER,
        },
        (newSpan) => {
          return initializeSpan(
            { name: spanName, span: newSpan, tracer },
            req,
            next
          );
        }
      );
    }

    return initializeSpan({ name: spanName, span, tracer }, req, next);
  };
}

function initializeSpan(
  opts: { name: string; span: Span; tracer: Tracer },
  req: Request & OpenTelemetryTracingMiddleware,
  next: NextFunction
) {
  console.info(`starting trace id: ${opts.span.spanContext().traceId}`);

  opts.span.updateName(opts.name);
  opts.span.setStatus({
    code: SpanStatusCode.OK,
  });
  Sentry.setContext('opentelemetry', {
    traceId: opts.span.spanContext().traceId,
  });

  req.telemetry = {
    sdk: api,
    rootSpan: opts.span,
    sentry: Sentry,
    tracer: opts.tracer,
  };

  return next();
}

export function openTelemetryError(
  error: Error & { status?: number },
  req: Request & OpenTelemetryTracingMiddleware,
  res: Response,
  next: NextFunction
) {
  req.telemetry.rootSpan.setStatus({
    code: SpanStatusCode.ERROR,
  });
  req.telemetry.rootSpan.setAttribute('error', true);
  req.telemetry.rootSpan.setAttribute('error.stack', error.stack || '');

  // only want to bubble up exceptions that are not caught
  if (!error.status || error.status >= 500) {
    req.telemetry.sentry.captureException(error);
  }

  return next(error);
}

export function openTelemetryRequest(
  req: Request & OpenTelemetryTracingMiddleware,
  res: Response
) {
  const oldWrite = res.write;
  const oldEnd = res.end;
  const responseChunks: any[] = [];
  res.write = function (chunk) {
    responseChunks.push(chunk);
    return oldWrite.apply(res, arguments as any);
  };

  res.end = function (chunk) {
    let body: string | null = null;
    if (Buffer.isBuffer(chunk)) {
      if (chunk) responseChunks.push(chunk);
      body = Buffer.concat(responseChunks).toString('utf8');
    } else if (typeof chunk === 'string') {
      body = chunk;
    }
    if (body) {
      req.telemetry.rootSpan.setAttribute('app.res.body', body);
    }

    // TODO obfuscate sensitive data when tracing is enabled on production
    req.telemetry.rootSpan.setAttributes({
      'app.req.headers': JSON.stringify(req.headers),
      'app.req.query': JSON.stringify(req.query),
      'app.req.body': JSON.stringify(req.body),
    });

    req.telemetry.rootSpan.updateName(
      `${req.method} ${req.baseUrl}${req.path}`
    );

    return oldEnd.apply(res, arguments as any);
  };
}
