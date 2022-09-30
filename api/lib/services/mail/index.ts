import fse from 'fs-extra';
import { Liquid } from 'liquidjs';
import { Transporter } from 'nodemailer';
import path from 'path';

import logger from '../../logger';
import { transporter } from '../../mailer';
import { SendMailOptions } from 'nodemailer';
import { TenantService } from '../tenant';
import { InvalidPayload } from 'lib/middlewares/exception';

const liquidEngine = new Liquid({
  root: [path.resolve(__dirname, 'templates')],
  extname: '.liquid',
});

export type EmailOptions = Omit<SendMailOptions, 'from'> & {
  tenant_id?: any;
  template?: {
    name: string;
    data: Record<string, any>;
  };
};

export class MailService {
  private transporter: Transporter;
  private from: string;

  constructor() {
    this.transporter = transporter;
    this.from = process.env.EMAIL_FROM as string;
  }

  checkMailer() {
    if (!this.transporter && transporter) {
      this.transporter = transporter;
    }
  }

  async send(options: EmailOptions): Promise<void> {
    this.checkMailer();
    if (!this.transporter) {
      return;
    }

    const { template, tenant_id, ...emailOptions } = options;
    let { html } = options;

    const tenant = await TenantService.getTenantById(tenant_id);

    if (template && tenant) {
      const templateData = {
        ...this.getDefaultTemplateData(tenant),
        ...template.data,
      };

      html = await this.renderTemplate(template.name, templateData);
    }

    try {
      await this.transporter.sendMail({
        ...emailOptions,
        from: this.from,
        html,
      });
    } catch (error) {
      logger.warn('[Email] Unexpected error while sending an email:');
    }
  }

  private async renderTemplate(
    template: string,
    variables: Record<string, any>
  ) {
    const templatePath = path.join(
      __dirname,
      'templates',
      template + '.liquid'
    );

    const pathExists = await fse.pathExists(templatePath);
    if (!pathExists) {
      throw new InvalidPayload(`Template "${template}" doesn't exist.`);
    }

    const templateString = await fse.readFile(templatePath, 'utf8');
    const html = await liquidEngine.parseAndRender(templateString, variables);

    return html;
  }

  private getDefaultTemplateData(tenant: any) {
    return {
      projectName: tenant?.name || 'Identifee',
      projectColor: tenant?.colors?.primaryColor || '#111b51',
      projectLogo:
        tenant?.logo || `${process.env.PUBLIC_URL}/img/logo-white.png`,
    };
  }
}
