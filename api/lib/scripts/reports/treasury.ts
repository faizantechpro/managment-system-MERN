import * as dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';

// load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { Report, ReportConfig } from '../../biz/Report/Report';
import { getReportInstance } from './../../biz/report';
const { input } = require('./treasury.json');

async function run() {
  const instance = getReportInstance(input);
  if (!instance) {
    throw new Error('check your test json');
  }

  await instance.render();
  await instance.writeTmpPDF();
  await writeTmpHTML(instance);
  console.log('finished rendering...');
  process.exit(0);
}

/**
 * Writes the rendered HTML into tmp storage
 *
 * This is more of a debug thing because css...
 */
async function writeTmpHTML(report: Report<ReportConfig>) {
  if (!report.renderedHTML) {
    throw new Error('HTML must be rendered first');
  }

  fs.writeFileSync(`${report.getPDFPath()}.html`, report.renderedHTML);
}

run();
