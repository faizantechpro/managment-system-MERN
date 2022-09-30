import Bluebird from 'bluebird';
import {
  SpSummaryAggregationType,
  SpSummaryCreateDAO,
} from 'lib/middlewares/sequelize';
import { Ensure } from 'lib/utils';
import { v4 } from 'uuid';
import DAO from './utils/DAO';

export class SpDAO extends DAO<'SpSummaryDB'> {
  async findAllByAggregationType(type: SpSummaryAggregationType[]) {
    const summaries = await this.repo.findAll({
      where: {
        aggregation_type: type,
      },
    });

    return this.rowsToJSON<{ aggregation_type: 'AVERAGE' }>(summaries);
  }

  async findAllByCode(code: string[]) {
    const summaries = await this.repo.findAll({
      include: [
        {
          as: 'naics_sp',
          model: this.repo.associations.naics_sp.target,
          where: {
            code,
          },
          attributes: ['code'],
          required: true,
          nested: true,
        },
      ],
    });

    return this.rowsToJSON<{ naics_sp: { code: string }[] }>(summaries);
  }

  async findOneByCode(code: string) {
    const summary = await this.repo.findOne({
      include: [
        {
          as: 'naics_sp',
          model: this.repo.associations.naics_sp.target,
          where: {
            code,
          },
          attributes: [],
          required: true,
        },
      ],
    });

    return this.toJSON(summary);
  }

  async findOneByAggregationType(type: SpSummaryAggregationType) {
    const summary = await this.repo.findOne({
      where: {
        aggregation_type: type,
      },
    });

    return this.toJSON(summary);
  }

  async bulkUpsert(payloads: (SpSummaryCreateDAO & { id: string })[]) {
    await Bluebird.map(payloads, async (payload) => this.repo.upsert(payload), {
      concurrency: 25,
    });
  }

  async bulkUpsertAggregations(
    payloads: (Ensure<SpSummaryCreateDAO, 'aggregation_type'> & {
      id?: string;
    })[]
  ) {
    const aggregations = await this.findAllByAggregationType(
      payloads.map(({ aggregation_type }) => aggregation_type)
    );

    const upsertPayloads = payloads.map((payload) => {
      const aggregation = aggregations.find(
        ({ aggregation_type }) => aggregation_type === payload.aggregation_type
      );
      payload.id = aggregation ? aggregation.id : v4();
      return payload;
    });

    await this.bulkUpsert(
      upsertPayloads as (SpSummaryCreateDAO & { id: string })[]
    );
  }

  /**
   * Upserts the NAICS N:M association with S&P Summary
   */
  async bulkUpsertWithCodes(
    payloads: (SpSummaryCreateDAO & { codes: string[] })[]
  ) {
    const codes = Array.from(
      payloads.reduce((acc, summary) => {
        summary.codes.forEach((code) => acc.add(code));
        return acc;
      }, new Set<string>())
    );

    const summaries = await this.findAllByCode(codes);

    const upsertPayloads = payloads.map((payload) => {
      const summary = summaries.find(({ naics_sp }) => {
        return naics_sp.some(({ code }) => payload.codes.includes(code));
      });

      return {
        ...payload,
        id: summary ? summary.id : v4(),
      };
    });

    await this.bulkUpsert(upsertPayloads.map(({ codes, ...rest }) => rest));

    const naicsSpPayloads = upsertPayloads.reduce((acc, payload) => {
      const flattenedNaics = payload.codes.map((code) => ({
        code,
        sp_summary_id: payload.id,
      }));

      return acc.concat(...flattenedNaics);
    }, [] as { code: string; sp_summary_id: string }[]);

    await Bluebird.map(
      naicsSpPayloads,
      async (payload) => this.repo.associations.naics_sp.target.upsert(payload),
      { concurrency: 25 }
    );
  }
}
