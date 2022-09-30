import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import {
  ExpressInstrumentation,
  ExpressLayerType,
} from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { SequelizeInstrumentation } from 'opentelemetry-instrumentation-sequelize';
import { OTTracePropagator } from '@opentelemetry/propagator-ot-trace';
import { Resource } from '@opentelemetry/resources';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/tracing';
import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';

export function initializeTracer(
  serviceName: string,
  environment: string,
  opts: {
    enabled: boolean;
    consoleEnabled: boolean;
    sentryHost?: string;
    zipkinHost?: string;
  }
) {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
    }),
  });

  provider.register({ propagator: new OTTracePropagator() });

  if (!opts.enabled) {
    const tracer = provider.getTracer(serviceName);
    return tracer;
  }
  if (opts.consoleEnabled) {
    const consoleExporter = new ConsoleSpanExporter();
    provider.addSpanProcessor(new BatchSpanProcessor(consoleExporter) as any);
  }
  if (opts.sentryHost) {
    Sentry.init({
      dsn: opts.sentryHost,
      environment,
      integrations: [
        new RewriteFrames({
          root: (global as any).__rootdir__,
        }),
      ],
      tracesSampleRate: 1.0,
    });
  }
  if (opts.zipkinHost) {
    const zipkinExporter = new ZipkinExporter({
      url: opts.zipkinHost,
    });
    provider.addSpanProcessor(new BatchSpanProcessor(zipkinExporter) as any);
  }

  registerInstrumentations({
    instrumentations: [
      new ExpressInstrumentation({
        ignoreLayersType: [
          ExpressLayerType.ROUTER,
          ExpressLayerType.REQUEST_HANDLER,
        ],
      }),
      new HttpInstrumentation({
        ignoreIncomingRequestHook: (req) => {
          // want to ignore health probes
          const probeEndpoints = [
            '/health',
            '/live',
            '/metrics',
            '/ready',
            '/status',
          ];
          const isProbe = probeEndpoints.some(
            (endpoint) =>
              // also ensure this isn't a path that's a base for some feature route
              req.url?.includes(endpoint) && !req.url?.includes(`${endpoint}/`)
          );
          if (isProbe) {
            return true;
          }

          // base path for api endpoints
          return req.url ? !req.url.startsWith('/api') : false;
        },
      }),
      // new PgInstrumentation(),
      new SequelizeInstrumentation() as any,
    ],
  });

  // need this for instrumentation...
  require('http');
  require('sequelize');
  // require('pg');
  require('express');

  const tracer = provider.getTracer(serviceName);
  return tracer;
}
