import * as ejs from 'ejs';
import * as fs from 'fs';
import puppeteer from 'puppeteer';

import { ReportInput, ReportType } from 'lib/database/models/report/report';
import { cssAsBinary, ReportOutput } from './utils';
import { FilesService } from 'lib/services';
import { UserContext } from 'lib/middlewares/openapi';

// Extracts the report input or output type
type ExtractReportIO<
  T extends ReportType,
  IO extends ReportInput | ReportOutput
> = {
  [K in IO['type']]: Extract<IO, { type: K }>;
}[T];

// Child classes should extend this config based on their own I/O
export type ReportConfig<T extends ReportType = ReportType> = {
  input: ExtractReportIO<T, ReportInput>;
  output?: ExtractReportIO<T, ReportOutput>;
};

export abstract class Report<T extends ReportConfig> {
  protected type: T['input']['type'];
  protected tmpLocation: string;
  protected fileService: FilesService;

  public input: T['input'];
  public output?: T['output'];
  public renderedHTML?: string;
  public requestDate: Date;
  public rendered: boolean;

  constructor(config: T, tmpLocation: string) {
    this.type = config.input.type;
    this.input = config.input;
    this.tmpLocation = tmpLocation;

    this.fileService = new FilesService();
    this.requestDate = new Date();
    this.rendered = false;
  }

  /**
   * Writes the PDF to local tmp storage
   */
  public async writeTmpPDF() {
    // this class should not know how to render child partials
    if (!this.renderedHTML) {
      throw new Error('HTML must be rendered first');
    }

    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.setContent(this.renderedHTML, { waitUntil: 'networkidle2' });

    await page.pdf({ format: 'letter', path: this.getPDFPath() });

    this.rendered = true;
    return;
  }

  /**
   * Removes the PDF from local tmp storage
   *
   * Note: this does NOT remove from cloud storage if that was done
   */
  public async removeTmpPDF() {
    fs.unlinkSync(this.getPDFPath());
    this.rendered = false;
  }

  public getPDFPath() {
    return `${this.tmpLocation}/${this.getReportTitle()}`;
  }

  /**
   * Stores PDF into permanent storage
   */
  public async storePDF(user: UserContext) {
    // this class should not know how to render child partials
    if (!this.renderedHTML) {
      throw new Error('HTML must be rendered first');
    }
    if (!this.rendered) {
      await this.writeTmpPDF();
    }

    const stats = fs.statSync(this.getPDFPath());

    const file = {
      tenant_id: user.tenant,
      storage: 's3',
      // filename_disk: `${title}.html`,
      filename_download: this.getReportTitle(),
      title: this.getReportTitle(),
      type: 'application/pdf',
      // folder: null,
      uploaded_by: user.id,
      uploaded_on: this.requestDate,
      modified_by: user.id,
      modified_on: this.requestDate,
      // charset: null,
      filesize: stats.size,
      // width: null,
      // height: null,
      // duration: null,
      // embed: null,
      description: `${
        this.type
      } report created on ${this.requestDate.toISOString()}`,
      // location: null,
      // tags: null,
      // metadata: null,
    };
    const fileId = (await this.fileService.uploadOne(
      fs.createReadStream(this.getPDFPath()),
      file,
      false
    )) as string;

    return fileId;
  }

  /**
   * Takes a child's report fragment and encapsulates with outer sections
   *
   * Provided component should be an HTML string of a React component
   */
  async fullRender(component: string): Promise<string> {
    const base = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${this.type} Report</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
          <link rel="stylesheet" href="${cssAsBinary(
            '/templates/reports/report.css'
          )}" >
        </head>
        <body>
          <div id="root"><%- component %></div>
        </body>
      </html>
    `;

    const html = ejs.render(base, {
      component,
    });

    this.renderedHTML = html;
    return this.renderedHTML;
  }

  /**
   * Report title to be used for storage.
   */
  abstract getReportTitle(): string;

  /**
   * Renders HTML fragment for report
   */
  abstract render(): Promise<string>;

  /**
   * Generates calculations for reports
   */
  abstract calculate(): Promise<
    ExtractReportIO<T['input']['type'], ReportOutput>
  >;
}
