import Base from '../utils/Base';
import { DealStage } from 'lib/database';
import {
  DealStageModel,
  DealStageModifyAttributes,
} from 'lib/database/models/deal';
import { AuthUser } from 'lib/middlewares/auth';

class DealStageService extends Base<DealStageModel> {
  async bulkUpdateOrCreate(names: DealStageModifyAttributes[]) {
    const dealStages = await DealStage.bulkCreate(names, {
      updateOnDuplicate: ['name'],
    });
    return dealStages.map((dealStage) => dealStage.toJSON());
  }
}

export function DealStageServiceFactory(user: AuthUser) {
  return new DealStageService(DealStage, user);
}
