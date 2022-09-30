import { v4 as uuidv4 } from 'uuid';
import {
  ReportInsightCreateAttributes,
  ReportInsightModel,
  ReportInsightUpdateAttributes,
} from 'lib/database/models/report';
import { Pagination } from 'lib/types';
import Base from '../utils/Base';
import { ReportInsight } from 'lib/database';
import { AuthUser } from 'lib/middlewares/auth';

export class ReportInsightService extends Base<ReportInsightModel> {
  async getByReportId(reportId: string, pagination: Pagination) {
    const { count, rows } = await this.model.findAndCountAll({
      where: {
        report_id: reportId,
      },
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(rows, count, pagination);
  }

  async getOne(reportInsightId: string) {
    return super.defaultFindById(reportInsightId);
  }

  async create(payload: ReportInsightCreateAttributes) {
    payload.id = uuidv4();
    payload.created_by = this.user.id;

    return super.defaultCreate(payload);
  }

  async update(id: string, payload: ReportInsightUpdateAttributes) {
    return super.defaultUpdateById(id, payload);
  }

  async delete(id: string) {
    return super.defaultDeleteById(id);
  }
}

export function reportInsightServiceFactory(user: AuthUser) {
  return new ReportInsightService(ReportInsight, user);
}
