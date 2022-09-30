import { NAICS, RPMGTransactionSummary, RPMGVertical } from 'lib/database';
import {
  RPMGTransactionModel,
  RPMGTransactionSummaryModel,
  RPMGVerticalModel,
} from 'lib/database/models/rpmg';
import { UserContext } from 'lib/middlewares/openapi';
import Base from '../utils/Base';

class RPMGService extends Base<RPMGVerticalModel> {
  private defaultVertical = 'All Organizations';

  /**
   * "All Organizations" is the catch all for RPMG summary data in case there's
   * no summary for the provided NAICS
   */
  async getDefaultSummary(): Promise<
    | (RPMGVerticalModel['_attributes'] & {
        transaction_summary: (RPMGTransactionSummaryModel['_attributes'] & {
          transaction: RPMGTransactionModel['_attributes'];
        })[];
      })
    | null
  > {
    const verticalSummary = await this.model.findOne({
      where: {
        industry: this.defaultVertical,
      },
      include: [
        'summary',
        {
          as: 'transaction_summary',
          model: RPMGTransactionSummary,
          include: ['transaction'],
        },
      ],
    });
    // if this happens, there's a missing migration/seed is
    if (!verticalSummary) {
      return null;
    }

    const verticalSummaryJSON = verticalSummary.toJSON();

    if (verticalSummaryJSON) {
      (verticalSummaryJSON as any).naics = null;
    }

    // TODO find how to properly type joins..
    return verticalSummaryJSON as Awaited<
      ReturnType<RPMGService['getSummaryByCode']>
    >;
  }

  async getSummaryByCode(code: string): Promise<
    | (RPMGVerticalModel['_attributes'] & {
        transaction_summary: (RPMGTransactionSummaryModel['_attributes'] & {
          transaction: RPMGTransactionModel['_attributes'];
        })[];
      })
    | null
  > {
    const verticalSummary = await this.model.findOne({
      include: [
        'summary',
        {
          as: 'transaction_summary',
          model: RPMGTransactionSummary,
          include: ['transaction'],
        },

        // restrict searching by code
        {
          as: 'naics',
          model: NAICS,
          where: {
            code,
          },
          // remove unnecessary through attrs
          through: {
            attributes: [],
          },
          required: true,
        },
      ],
    });
    if (!verticalSummary) {
      return null;
    }

    const verticalSummaryJSON = verticalSummary.toJSON();

    if (verticalSummaryJSON) {
      (verticalSummaryJSON as any).naics = (
        verticalSummaryJSON as any
      ).naics[0];
    }

    // TODO find how to properly type joins..
    return verticalSummaryJSON as Awaited<
      ReturnType<RPMGService['getSummaryByCode']>
    >;
  }
}

export function rpmgServiceFactory(user: UserContext) {
  return new RPMGService(RPMGVertical, user);
}
