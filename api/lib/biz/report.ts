import { ReportInput } from 'lib/database/models/report/report';
import { exception } from 'lib/middlewares/exception';
import { UserContext } from 'lib/middlewares/openapi';
import { reportFactory } from './Report/index';
import { ReportOutput } from './Report/utils';

export function getReportInstance(input: ReportInput) {
  return reportFactory(
    {
      input,
    },
    process.env.REPORTS_DIR || '/tmp'
  );
}

export async function getOutput(
  input: ReportInput
): Promise<ReportOutput | undefined> {
  const reportInstance = getReportInstance(input);
  if (!reportInstance) {
    return;
  }

  return reportInstance.calculate();
}

// Transforms `month` to a valid ISO date string.
// TODO remove the use of this function by migrating `month` to ISO string field
export function parseDate(month: string) {
  let date = month;
  if (month.length === 'YYYYMM'.length && !month.includes('-')) {
    // day 5 is appended as YYYY-MM format may lead to incorrect date due to timestamp shift...
    date = `${month.substring(0, 4)}-${month.substr(4)}-05`;
    date = new Date(date).toISOString();
  }
  return date;
}

/**
 * Creates and generates a report given the user input
 */
export async function generate(
  input: ReportInput,
  user: UserContext
): Promise<
  { input: ReportInput; output: ReportOutput; file_id: string } | undefined
> {
  const reportInstance = getReportInstance(input);
  if (!reportInstance) {
    return; // report type not implemented
  }

  await reportInstance.render();

  // shouldn't happen but throw 500 in case it does
  if (!reportInstance.output) {
    throw new exception.InternalServerError();
  }

  const fileId = await reportInstance.storePDF(user);
  await reportInstance.removeTmpPDF();

  return {
    input: reportInstance.input,
    output: reportInstance.output,
    file_id: fileId,
  };
}
