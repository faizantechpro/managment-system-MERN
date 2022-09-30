import { NextFunction, Request, Response } from 'express';
import { OpenAPIV3 } from 'openapi-types';
import { authenticate, AuthMiddleware } from '../auth';
import { ExceptionMiddleware } from '../exception';
import { appendDefaultsToDocs } from './helpers';
import { OpenAPIMiddleware, OpenAPIRequestMiddleware } from './types';

export function securityFilter(
  req: Request & OpenAPIMiddleware,
  res: Response,
  next: NextFunction
) {
  req.apiDoc = appendDefaultsToDocs(req.apiDoc, true);

  return res.json(req.apiDoc);
}

function convertOneOfToAnyOf(
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
) {
  if ('allOf' in schema && schema.allOf) {
    schema.allOf.map((entry) => convertOneOfToAnyOf(entry));
  }
  if ('oneOf' in schema && schema.oneOf) {
    schema.anyOf = schema.oneOf;
    delete schema.oneOf;
  }
}

/**
 * Performs authorization checks
 */
export async function authorizationHandler(
  req: OpenAPIRequestMiddleware & AuthMiddleware & ExceptionMiddleware
) {
  // if (
  //   req.operationDoc.requestBody &&
  //   'content' in req.operationDoc.requestBody &&
  //   req.operationDoc.requestBody.content &&
  //   req.operationDoc.requestBody.content['application/json'] &&
  //   req.operationDoc.requestBody.content['application/json'].schema
  // ) {
  //   convertOneOfToAnyOf(
  //     req.operationDoc.requestBody.content['application/json'].schema
  //   );
  // }

  // no security defined
  if (!req.operationDoc.security) {
    return true;
  }
  // auth middleware is required to be executed first
  if (!req.user) {
    // allow optional auth
    if (
      'x-authz' in req.operationDoc &&
      req.operationDoc['x-authz'] &&
      req.operationDoc['x-authz'].optional
    ) {
      try {
        await authenticate(req);
      } catch (error) {
        // unauthed but ignore error
        delete (req as any).user;
        return true;
      }
    }

    if (!req.user) {
      return false;
    }
  }

  if ('x-authz' in req.operationDoc) {
    const authz = req.operationDoc['x-authz']!;
    let hasRequiredScope = false || req.operationDoc['x-authz']?.optional;
    let hasAllowedScope = false || req.operationDoc['x-authz']?.optional;

    if (authz.requiredScope) {
      hasRequiredScope = authz.requiredScope === req.user.jwt.scope;
    }
    if (authz.allowedScopes) {
      hasAllowedScope = authz.allowedScopes.some(
        (scope) => scope === req.user.jwt.scope
      );
    }

    const isAuthorized = hasRequiredScope || hasAllowedScope;
    if (!isAuthorized) {
      throw new req.exception.Forbidden();
    }

    return true;
  }

  // admin should have full access
  if (req.user.auth.isAdmin) {
    return true;
  }

  // guest shouldn't be allowed to access routes by default
  if (req.user.jwt.scope === 'guest') {
    throw new req.exception.Forbidden();
  }

  // do nothing for routes without x-authz
  return true;
}
