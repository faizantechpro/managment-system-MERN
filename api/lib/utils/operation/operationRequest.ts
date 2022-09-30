import { Response } from 'express';
import { APIRequest } from './types';

export function operationRequest(req: APIRequest, res: Response) {
  const endOperation = (req: APIRequest, res: Response) => {
    const isOpenAPIOperation =
      !!req.operationDoc && !!req.operationDoc.operationId;

    console.info(
      `ending trace id: ${req.telemetry.rootSpan.spanContext().traceId}`
    );
    if (!isOpenAPIOperation) {
      req.telemetry.rootSpan.end();
      return;
    }

    const path = req.openAPI.getPath(req.operationDoc.operationId);
    if (path) {
      req.telemetry.rootSpan.setAttribute('openapi.path', path);
    }
    req.telemetry.rootSpan.setAttribute(
      'openapi.operation',
      req.operationDoc.operationId
    );
    req.telemetry.rootSpan.end();
  };

  res.once('close', endOperation.bind(null, req, res));
  res.once('error', endOperation.bind(null, req, res));
}
