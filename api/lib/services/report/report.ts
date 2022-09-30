import { v4 as uuidv4 } from 'uuid';
import { Range } from '@directus/drive';
import { Readable } from 'stream';

import { FilesService } from '../files';
import {
  ReportCreateAttributes,
  ReportModel,
  ReportType,
  ReportUpdateAttributes,
} from 'lib/database/models/report/report';
import { Pagination } from 'lib/types';
import { Report } from '../../database';
import { MailService } from '../mail';
import { AssetsService } from '../assets';
import { Transformation } from '../../types/assets';
import ParseSequelizeResponse from 'lib/utils/parseSequelizeResponse';
import { StaticModel } from 'lib/database/helpers';
import { Guest } from '../utils/Guest';
import { TenantService } from '../tenant';
import ContextQuery from '../utils/ContextQuery';
import { feedLogServiceFactory } from '../feed';
import { AuthUser } from 'lib/middlewares/auth';
import { Forbidden } from 'lib/middlewares/exception';

abstract class ReportService extends ContextQuery<ReportModel> {
  /**
   * Get all reports for a user organization with optional filter by type.
   */
  async getByOrganization(
    organizationId: string,
    pagination: Pagination,
    opts?: { type?: ReportType }
  ) {
    const { count, rows } = await this.model.findAndCountAll({
      where: {
        organization_id: organizationId,
        ...(opts?.type ? { type: opts.type } : {}),
        ...this.getContextQuery(),
      },
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(rows, count, pagination);
  }

  /**
   * Get a report that belongs to a user
   */
  async getOne(reportId: string, opts: { include?: string[] } = {}) {
    const report = await this.model.findOne({
      where: {
        id: reportId,
        ...this.getContextQuery(),
      },
      ...(opts.include ? { include: opts.include } : {}),
    });

    return report?.toJSON();
  }

  /**
   * Stores a generate report into db.
   */
  async create(payload: ReportCreateAttributes) {
    const reportId = uuidv4();
    payload.id = reportId;
    payload.created_by = this.user.id;

    await this.model.create(payload);

    await this.feedLog.create({
      tenant_id: payload.tenant_id,
      type: 'report',
      summary: 'Report added',
      organization_id: payload.organization_id,
      object_data: payload,
      created_by: this.user.id,
    });

    const report = await this.getOne(reportId);
    return report!;
  }

  async update(id: string, payload: ReportUpdateAttributes) {
    const currentReport = await this.getOne(id);

    await this.model.update(payload, {
      where: { id, ...this.getContextQuery() },
    });

    const report = await this.getOne(id);

    await this.feedLog.createOnDiff(
      {
        type: 'report',
        summary: 'Report updated',
        organization_id: payload.organization_id,
      },
      currentReport,
      payload,
      {
        exclude: ['created_at', 'updated_at'],
      }
    );

    return report;
  }

  async delete(id: string) {
    await this.model.destroy({
      where: {
        id,
        ...this.getContextQuery(),
      },
    });

    return;
  }
}

/**
 * Admin implementation which allows querying regardless of user id.
 */
export class AdminReportService extends ReportService {
  getContextQuery() {
    return {};
  }
}

/**
 * User implementation which restricts querying to current user id context
 */
export class UserReportService extends ReportService {
  getContextQuery() {
    return {
      created_by: this.user.id,
    };
  }
}

export class GuestReportService<
  T extends StaticModel<ReportModel> = StaticModel<ReportModel>
> extends ReportService {
  private guest: Guest;

  constructor(model: T, user: AuthUser) {
    super(model, user);

    this.guest = new Guest(this.user);
  }

  getContextQuery() {
    if (this.user.jwt.scope !== 'guest') {
      throw new Error('invalid context');
    }
    return {
      organization_id: this.user.jwt.resource_access.organization[0].id,
    };
  }

  async getByOrganization(
    organizationId: string,
    pagination: Pagination,
    opts?: { type?: ReportType }
  ) {
    this.guest.validate(organizationId);

    return super.getByOrganization(organizationId, pagination, opts);
  }

  async getOne(reportId: string) {
    return super.getOne(reportId, {
      include: ['organization', 'user'],
    });
  }

  /**
   * Block guest user from making any modifications
   */
  async create() {
    throw new Forbidden();
    return super.create({} as any);
  }
  async update() {
    throw new Forbidden();
    return super.update('', {} as any);
  }
  async delete() {
    throw new Forbidden();
  }
}

export function reportServiceFactory(user: AuthUser) {
  if (user.auth.isAdmin) {
    return new AdminReportService(Report, user);
  } else if (user.jwt.scope === 'guest') {
    return new GuestReportService(Report, user);
  }
  return new UserReportService(Report, user);
}

export const sendReportToEmail = async (
  email: string,
  reportName: string,
  fileName: string,
  fileId: string,
  organizationId: string,
  user: AuthUser,
  subject?: string | null,
  message?: string | null
): Promise<void> => {
  const feedLogService = feedLogServiceFactory(user);
  const mailService = new MailService();
  const assetService = new AssetsService();

  const subjectLine = subject
    ? subject
    : 'Download the prospecting report shared with you';

  const messageLine = message
    ? message
    : 'The emissary has not written an additional message.';

  const transformation: Transformation = {} as Transformation;
  const range: Range | undefined = undefined;
  const asset = await assetService.getAsset('', fileId, transformation, range);
  const newReader = new Readable().wrap(asset.stream);

  const service = new FilesService();
  const fileInfo = await service.readOne(fileId, {});
  const { id, filename_download, filesize, type, uploaded_on } =
    ParseSequelizeResponse(fileInfo);

  const dataObject = {
    id: id,
    filename_download: filename_download,
    report_name: reportName,
    type: type,
    uploaded_on: uploaded_on,
  };

  await feedLogService.create({
    tenant_id: user.tenant,
    created_by: user.id,
    organization_id: organizationId,
    type: 'report',
    summary: 'Shared report',
    object_data: dataObject,
  });

  const tplData = await TenantService.getMailThemeData(user.tenant);

  return await mailService.send({
    to: email,
    tenant_id: user.tenant,
    subject: subjectLine,
    attachments: [
      {
        filename: asset.file.filename_download,
        content: newReader,
      },
    ],
    template: {
      name: 'report-email',
      data: {
        ...tplData,
        messageLine,
      },
    },
  });
};
