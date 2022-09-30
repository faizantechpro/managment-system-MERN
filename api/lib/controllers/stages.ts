import express from 'express';
import { InvalidPayload } from 'lib/middlewares/exception';
import {
  dealServiceFactory,
  DealStageServiceFactory,
  TenantDealStageServiceFactory,
} from 'lib/services/deal';

const router = express.Router();

const path = '/stages';

router.get(path, async (req, res) => {
  const { user } = req;
  const tenantdealstageService = TenantDealStageServiceFactory(user);
  const tenantDealStages = await tenantdealstageService.getAll();
  return res.json(tenantDealStages);
});

router.patch(`${path}/bulk/update`, async (req, res) => {
  const { user, body } = req;
  const { deal_stages } = body;

  if (!deal_stages) throw new InvalidPayload('deal stages not provided');

  const names = deal_stages.map((deal_stage: any) => ({
    name: deal_stage.name,
    description: deal_stage?.description,
  }));

  const dealStagesFactory = DealStageServiceFactory(user);
  const dealStages = await dealStagesFactory.bulkUpdateOrCreate(names);

  const probabilities = deal_stages.map(
    (deal_stage: any) => deal_stage.probability
  );

  const tenantsDealStages = dealStages.map((dealStage, index) => {
    const deal_stage = deal_stages[index];
    const deal_stage_id = dealStage.id;
    return {
      id: deal_stage?.id,
      deal_stage_id: deal_stage_id,
      position: deal_stage.position,
      probability: probabilities[index],
      tenant_id: user.tenant,
    };
  });

  const tenantDealStageFactory = TenantDealStageServiceFactory(user);
  const tenantDealStages = await tenantDealStageFactory.bulkUpdateOrCreate(
    tenantsDealStages
  );

  return res.json(tenantDealStages);
});

router.delete(`${path}/:id`, async (req, res) => {
  const { user, params, query } = req;
  if (query?.delete) {
    const dealFactory = dealServiceFactory(user);
    const deals = await dealFactory.findByTenantDealStageID(params.id);
    await Promise.all(deals.map((deal) => dealFactory.deleteOne(deal.id)));
  }
  const tenantDealStageFactory = TenantDealStageServiceFactory(user);
  await tenantDealStageFactory.deactive(params.id);
  res.json({ message: 'stages deleted successfully' });
});

export default router;
