import { Router } from 'express';
import { activityContactServiceFactory } from 'lib/services/activity-contact';

const router = Router();

const path = '/activity';

router.get(`${path}/:id/contacts`, async (req, res) => {
  const { params } = req;
  const service = activityContactServiceFactory(req.user);
  const response = await service.getByActivityId(params.id);
  return res.json(response);
});

export default router;
