import express from 'express';
import * as fs from 'fs';
import openapi from 'openapi-typescript';
import { appendDefaultsToDocs } from './helpers';
import { openAPIMiddleware } from './middleware';

const pkg = require('../../../../package.json');

(async () => {
  const res = openAPIMiddleware(express(), '/api', pkg, {
    enableGlob: true,
    exposeAPIDocs: true,
  });
  (res.apiDoc as any) = appendDefaultsToDocs(res.apiDoc);

  let types = await openapi(res.apiDoc);

  // SUPER hacky.... need to investigate a better way..
  types = types.replace(
    '| string',
    '| `last ${number} ${components["schemas"]["AnalyticGranularity"]}`'
  );
  types = types.replace(
    '| string;',
    '| `from ${number} ${components["schemas"]["AnalyticGranularity"]} ago to now`'
  );
  types = types.replace('Date: string;', 'Date: Date;');
  types = types.replace('| unknown[]', '| []');

  const schemaPath = 'lib/middlewares/openapi/types.gen.ts';
  fs.writeFileSync(schemaPath, types);
})();
