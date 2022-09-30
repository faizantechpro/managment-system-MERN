import { OpenAPIV3 } from 'openapi-types';

import { Scope } from 'lib/services/JWT';
import { operations } from './types.gen';
import { Request } from 'express';
import openapi from './schemas.gen.json';

const {
  components: { schemas },
} = openapi;
export const apiSchemas = { ...schemas } as unknown as {
  [K in keyof typeof schemas]: OpenAPIV3.SchemaObject;
};

/**
 * Custom extensions made onto OpenAPI operation objects which allow us to add
 * custom attributes
 */
export type OpenAPIDoc = OpenAPIV3.OperationObject & {
  'x-authz'?: {
    // For now, we only provide one scope per token
    requiredScope?: Scope;
    allowedScopes?: Scope[];
    // TODO use this sparingly as OpenAPI allows optional auth but
    // we add additional user context in auth handler, needs refactoring
    optional?: boolean;
  };
  operationId: string;
};

export type OpenAPIJSONContent = {
  content: {
    'application/json': any;
  };
};
export type OpenAPIFormDataContent = {
  content: {
    'multipart/form-data': any;
  };
};

export type OpenAPIOperationId = keyof operations;

export type OpenAPIMiddleware = {
  apiDoc: OpenAPIV3.Document;
  operationDoc: OpenAPIDoc;
  openAPI: {
    getPath: (operationId: string) => string | undefined;
  };
};

export type OpenAPIRequestMiddleware<
  OpId extends OpenAPIOperationId = OpenAPIOperationId
> = OpenAPIMiddleware &
  Omit<Request, 'body' | 'params' | 'query' | 'user'> & {
    // Reach into our docs and override Express types
    body: operations[OpId] extends {
      requestBody: {
        content: { 'application/json': any; 'multipart/form-data': any };
      };
    }
      ? // this is pretty gnarly.... got to revisit. Maybe rely on `file`?
        | operations[OpId]['requestBody']['content']['application/json']
          | operations[OpId]['requestBody']['content']['multipart/form-data']
      : operations[OpId] extends { requestBody: OpenAPIJSONContent }
      ? operations[OpId]['requestBody']['content']['application/json']
      : operations[OpId] extends { requestBody: OpenAPIFormDataContent }
      ? operations[OpId]['requestBody']['content']['multipart/form-data']
      : any;
    params: operations[OpId] extends { parameters: { path: any } }
      ? operations[OpId]['parameters']['path']
      : any;
    query: operations[OpId] extends { parameters: { query: any } }
      ? operations[OpId]['parameters']['query']
      : any;
    operationDoc: {
      operationId: OpId;
    };
  };

/**
 * We're only interested in the object representation of an openapi schema.
 * This type simply extracts the `json` response keyed off by status code.
 */
export type OpenAPIResponseByCode<Responses = any> = Responses extends {
  [K: string]: OpenAPIJSONContent;
}
  ? {
      [K in keyof Responses]: Responses[K]['content']['application/json'];
    }
  : never;

/**
 * Type guard function to determine whether the given request is the type specified
 * by the given operationId
 */
export function isOpenAPIRequest<T extends OpenAPIOperationId>(
  operationId: T,
  req: any
): req is OpenAPIRequestMiddleware<T> {
  return req?.operationDoc?.operationId === operationId;
}

export type IsOpenAPIRequestFn<T extends OpenAPIOperationId> = (
  req: any
) => req is OpenAPIRequestMiddleware<T>;

/**
 * Returns a function to determine whether any of the operation ids matches
 * the given request. Ideally this should be used in situations where path
 * params are all equivalent among the operation ids.
 *
 * e.g.:
 * GET /contacts/contact_id (operationId = getContactById)
 * PUT /contacts/contact_id (operationId = updateContactById)
 * DELETE /contacts/contact_id (operationId = deleteContactById)
 *
 * const isContactRequest = isGenerateRequest(
 *  'getContactById',
 *  'updateContactById',
 *  'deleteContactById'
 * )
 * ...
 * if (isContactRequest(req)) {
 *   req.params.contact_id // now valid for any of GET/PUT/DELETE
 * }
 *
 * With the above, we can now deduce that request is a contact request and
 * our req object will have the applicable typ
 */
export function isGenericOpenAPIRequest<T extends OpenAPIOperationId>(
  ...operationIds: [T, ...T[]]
): IsOpenAPIRequestFn<T> {
  return ((req: any) => {
    return operationIds.some((operationId) =>
      isOpenAPIRequest(operationId, req)
    );
  }) as IsOpenAPIRequestFn<T>;
}
