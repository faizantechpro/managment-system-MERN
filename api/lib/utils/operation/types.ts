import { Response } from 'express';
import { AuthUser } from 'lib/middlewares/auth';
import { ContextMiddleware } from 'lib/middlewares/context';
import { EmitterMiddleware } from 'lib/middlewares/emitter';
import { ExceptionMiddleware } from 'lib/middlewares/exception';
import {
  OpenAPIRequestMiddleware,
  OpenAPIResponseByCode,
  OpenAPIOperationId,
  OpenAPIJSONContent,
} from 'lib/middlewares/openapi';
import { operations } from 'lib/middlewares/openapi/types.gen';
import { OpenTelemetryTracingMiddleware } from 'lib/middlewares/opentelemetry';
import { ResponseMiddleware } from 'lib/middlewares/response';

/**
 * Additional objects that are added to Express request object from other
 * dependencies.
 */
export type APIRequest<OpId extends OpenAPIOperationId = OpenAPIOperationId> =
  OpenAPIRequestMiddleware<OpId> &
    OpenTelemetryTracingMiddleware &
    Omit<ContextMiddleware, 'user'> &
    EmitterMiddleware &
    ExceptionMiddleware & /**
     * The following are for Authentication requests
     */ {
      user: operations[OpId] extends { responses: { 401: OpenAPIJSONContent } }
        ? AuthUser
        : OpId extends 'getAvatar' // TODO find a better way for optional auth
        ? AuthUser | undefined
        : AuthUser | undefined; // TODO investigate how to properly handle never cases
    };

export type APIResponse<OpId extends OpenAPIOperationId> = ResponseMiddleware<
  OpenAPIResponseByCode<operations[OpId]['responses']>
> &
  Omit<Response, 'json'>;
