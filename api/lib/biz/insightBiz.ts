import { OrganizationAttributes } from 'lib/database/models/organizations';
import { Conflict } from 'lib/middlewares/exception';
import { SpSummaryCreateDAO } from 'lib/middlewares/sequelize';
import { rpmgServiceFactory } from 'lib/services';
import { Biz, BizOpts } from './utils';

type SpInsightUpload = {
  type: 's&p';
  excel: {
    name: 'naics'; // e.g. 11, 11-33
    data: [
      [],
      [],
      // generally formatted as: DSO [2][1], DPO [2][2], WC [2][3], WCR [2][4]
      number[],
      (
        | 'DAYS_SALES_OUT'
        | 'DAYS_PAYABLE_OUT'
        | 'WORKING_CAP'
        | 'WORKING_CAP_RATIO'
      )[]
    ];
  }[];
};
type RpmgInsightUpload = {
  type: 'rpmg';
  excel: {
    name: string;
  }[];
};

/**
 * converting a range of numbers into a 2d array for better traversal
 *
 * e.g. given 3 ranges: <N, N-M, ..., >N
 * converts to following array:
 * [-Infinity, N], [N, M], ..., [N, Infinity]
 */
function strRangeToNumber<T extends {} = {}>(
  summary: ({ range: string } & T)[]
) {
  return summary
    .map((summary) => {
      return {
        ...summary,
        range: summary.range.split(/[><-]+/),
      } as { range: string[] } & T;
    })
    .map((summary) => {
      if (summary.range[0] === '') {
        // must be >N or <N format, remove leading
        summary.range.shift();
      }
      return summary;
    })
    .map((summary) => {
      // convert to num
      return {
        ...summary,
        range: summary.range.map((elem) => Number(elem)),
      } as { range: number[] } & T;
    })
    .reduce((acc, summary, idx, self) => {
      if (summary.range.length === 2) {
        acc.push(summary as { range: [number, number] } & T);
      } else if (summary.range.length === 1) {
        // all ranges are now [N], [N, M], ..., [N]
        // this is to determine whether our current index is infinity leading or trailing
        const isLowerBound = self.every(
          (innerSum) => innerSum.range[0] >= summary.range[0]
        );
        if (isLowerBound) {
          acc.push({
            ...summary,
            range: [-Infinity, summary.range[0]],
          });
        } else {
          acc.push({
            ...summary,
            range: [summary.range[0], Infinity],
          });
        }
      }

      return acc;
    }, [] as ({ range: [number, number] } & T)[]);
}

export class InsightBiz extends Biz {
  protected rpmgDAO: ReturnType<typeof rpmgServiceFactory>;

  constructor(opts: BizOpts) {
    super(opts);

    // TODO refactor this
    this.rpmgDAO = rpmgServiceFactory(this.user);
  }

  async findOneByCode(
    type: SpInsightUpload['type'] | RpmgInsightUpload['type'],
    code: string
  ) {
    if (type === 's&p') {
      let summary = await this.services.dao.sp.findOneByCode(code);
      if (!summary) {
        summary = await this.services.dao.sp.findOneByAggregationType(
          'AVERAGE'
        );
      }
      return summary;
    } else if (type === 'rpmg') {
      let summary = await this.rpmgDAO.getSummaryByCode(code);
      if (!summary) {
        summary = await this.rpmgDAO.getDefaultSummary();
      }
      return summary;
    }
  }

  async generateOrganizationInsights(organization: OrganizationAttributes) {
    if (!organization.naics_code) {
      throw new Conflict('Organization requires NAICS');
    }

    const [rpmg, sp] = await Promise.all([
      (async () => {
        const insights = await this.rpmgDAO.getSummaryByCode(
          organization.naics_code!
        );

        if (!insights) {
          return;
        }

        const summary = insights.transaction_summary.map((summary) => {
          return {
            id: summary.id,
            range: summary.transaction.range,
          };
        });
        const summaryWithRanges = strRangeToNumber<{ id: string }>(summary);

        const revenue = Number(organization.total_revenue) || 0;
        const summaryRange = summaryWithRanges.find(
          ({ range: [low, high] }) => {
            return low < revenue && revenue < high;
          }
        );

        if (!summaryRange) {
          return;
        }

        return insights.transaction_summary.find(
          ({ id }) => id === summaryRange.id
        )!;
      })(),
      (async () => {
        return this.services.dao.sp.findOneByCode(organization.naics_code!);
      })(),
    ]);

    return {
      rpmg,
      sp,
    };
  }

  async uploadXls(
    contents: SpInsightUpload | RpmgInsightUpload,
    reportDate?: string
  ) {
    const uploadDate = reportDate ? new Date(reportDate) : new Date();
    /**
     * Uploading insights requires specific format to always be followed. This is
     * meant to only be used internally so update accordingly when a 500 is thrown.
     */
    if (contents.type === 's&p') {
      const naicsSummary = contents.excel.reduce(
        (acc, data) => {
          // malformed names may contain spaces
          const name = data.name.split(' ')[0];
          // only want codes in digit format `123` or `42-43`
          if (!name.match(/^\d+$|^\d+-\d+$/g)) {
            return acc;
          }
          const columnNames = data.data[3];
          const dsoIndex = columnNames.indexOf('DAYS_SALES_OUT');
          const dpoIndex = columnNames.indexOf('DAYS_PAYABLE_OUT');
          const wcIndex = columnNames.indexOf('WORKING_CAP');
          const wcrIndex = columnNames.indexOf('WORKING_CAP_RATIO');

          acc.push({
            codes: [name],
            report_date: uploadDate,
            // see SPInsightUpload type for index
            // generally follows the type but sometimes sheet is malformed...
            days_sales_out: Math.round(data.data[2][dsoIndex]),
            days_payable_out: Math.round(data.data[2][dpoIndex]),
            working_capital: Math.round(data.data[2][wcIndex]),
            working_capital_ratio: Math.round(data.data[2][wcrIndex]),
          });

          return acc;
        },
        [] as ({
          codes: string[];
        } & SpSummaryCreateDAO)[]
      );

      naicsSummary.forEach((summary) => {
        // range, needs to be split
        if (summary.codes[0].includes('-')) {
          const naicsRange = strRangeToNumber([{ range: summary.codes[0] }]);
          const completeRange = [];
          for (
            let i = naicsRange[0].range[0];
            i <= naicsRange[0].range[1];
            i++
          ) {
            completeRange.push(i);
          }
          const naicsStr = completeRange.map((range) => range.toString());
          summary.codes = naicsStr;
        }
      });

      const average = naicsSummary.reduce(
        (acc, summary) => {
          acc.days_payable_out += summary.days_payable_out || 0;
          acc.days_sales_out += summary.days_sales_out || 0;
          acc.working_capital += summary.working_capital || 0;
          acc.working_capital_ratio += summary.working_capital_ratio || 0;

          return acc;
        },
        {
          report_date: uploadDate,
          days_sales_out: 0,
          days_payable_out: 0,
          working_capital: 0,
          working_capital_ratio: 0,
          aggregation_type: 'AVERAGE' as const,
        }
      );
      const getAverage = (sum: number, length: number) =>
        Math.round(sum / length);

      average.days_payable_out = getAverage(
        average.days_payable_out,
        naicsSummary.length
      );
      average.days_sales_out = getAverage(
        average.days_sales_out,
        naicsSummary.length
      );
      average.working_capital = getAverage(
        average.working_capital,
        naicsSummary.length
      );
      average.working_capital_ratio = getAverage(
        average.working_capital_ratio,
        naicsSummary.length
      );

      await this.services.dao.sp.bulkUpsertAggregations([average]);
      await this.services.dao.sp.bulkUpsertWithCodes(naicsSummary);
    }

    return;
  }
}
