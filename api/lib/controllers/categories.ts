import { Router } from 'express';

import { CategoryServiceFactory } from '../services/category';

const router = Router();

const path = '/categories';

router.put(`${path}/:id/position`, async (req, res) => {
  const { params, body } = req;
  const service = CategoryServiceFactory(req.user);
  await service.swapPosition(parseInt(params.id), body.position, req.user);
  return res.json({ message: 'position updated!' });
});

export default router;
