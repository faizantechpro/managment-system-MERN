import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { ContextQuery } from './utils';
import DAO from './utils/DAO';

export class DealDAO extends DAO<'DealDB'> {
  queryBuilder(
    context: ContextQuery,
    query: {
      start_date?: string;
      end_date?: string;
      search?: string;
      status?: string;
    } & {
      [k in string]?: any;
    }
  ) {
    const { start_date, end_date, search, status, ...rest } = query;

    const builder = this.where();
    if (search) {
      builder.iLike(search, 'name');
    }
    if (start_date && end_date) {
      builder.timeRange('date_entered', {
        start: start_date,
        end: end_date,
      });
    } else if (status) {
      // TODO revisit this....
      if (['won', 'lost'].includes(status)) {
        builder.merge({ status });
      } else if (status === 'deleted') {
        builder.merge({ deleted: true });
      } else if (status === 'opened') {
        builder.merge({
          status: null,
          deleted: false,
        });
      } else if (status === 'closed') {
        builder.merge({
          [Op.or]: { status: { [Op.in]: ['won', 'lost'] }, deleted: true },
        });
      }
    } else {
      builder.merge({
        deleted: false,
      });
    }

    builder.merge(rest);
    builder.context(context);

    return builder.build();
  }

  // Finds the deal summary grouped by the deal stage
  async findAllAsStageSummary(
    context: ContextQuery,
    query: Parameters<DealDAO['queryBuilder']>[1]
  ) {
    const where = this.queryBuilder(context, query);

    const summaries = await this.repo.findAll({
      attributes: [
        'tenant_deal_stage_id',
        [Sequelize.fn('sum', Sequelize.literal('amount')), 'total_amount'],
        [
          Sequelize.cast(
            Sequelize.fn('count', Sequelize.literal('tenant_deal_stage_id')),
            'integer'
          ),
          'total_count',
        ],
      ],
      group: ['tenant_deal_stage_id'],
      where,
    });

    const parsedSummaries = summaries.map((summary) => {
      return {
        tenant_deal_stage_id: summary.tenant_deal_stage_id,
        total_amount: summary.get('total_amount') as number,
        total_count: summary.get('total_count') as number,
      };
    });

    return parsedSummaries;
  }
}
