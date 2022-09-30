import { TenantDealStage, DealStage } from 'lib/database';
import {
  TenantDealStageModel,
  TenantDealStageModifyAttributes,
} from 'lib/database/models/deal';
import Base from '../utils/Base';
import { AuthUser } from 'lib/middlewares/auth';

class TenantDealStageService extends Base<TenantDealStageModel> {
  async getAll() {
    const tenantDealStages = await TenantDealStage.findAndCountAll({
      where: { tenant_id: this.user.tenant, active: true },
      include: [
        {
          model: DealStage,
          as: 'deal_stage',
          attributes: ['id', 'name', 'description', 'is_default'],
        },
      ],
      order: [['position', 'ASC']],
    });
    return tenantDealStages.rows;
  }

  async bulkUpdateOrCreate(
    tenantsDealStages: TenantDealStageModifyAttributes[]
  ) {
    const tenantDealStages = await TenantDealStage.bulkCreate(
      tenantsDealStages,
      {
        updateOnDuplicate: ['deal_stage_id', 'probability'],
      }
    );
    return tenantDealStages.map((tenantDealStage) => tenantDealStage.toJSON());
  }

  async deactive(id: string) {
    await TenantDealStage.update(
      { active: false },
      {
        where: { id, tenant_id: this.user.tenant },
      }
    );
  }
}

export function TenantDealStageServiceFactory(user: AuthUser) {
  return new TenantDealStageService(TenantDealStage, user);
}
