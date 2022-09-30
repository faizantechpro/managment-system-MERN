import express from 'express';
import { RelatedOrganizationServiceFactory } from 'lib/services/relatedOrganization';

const router = express.Router();

const path = '/organizations';

router.post(`${path}/related`, async (req, res) => {
  const service = RelatedOrganizationServiceFactory(req.user);
  const response = await service.add(req.body);
  res.json(response);
});

router.get(`${path}/:id/related`, async (req, res) => {
  const { id } = req.params;
  const service = RelatedOrganizationServiceFactory(req.user);
  const response = await service.get(id);
  res.json(response);
});

router.delete(`${path}/related/:id`, async (req, res) => {
  const { id } = req.params;
  const service = RelatedOrganizationServiceFactory(req.user);
  const response = await service.delete(id);
  res.json(response);
});

export default router;
