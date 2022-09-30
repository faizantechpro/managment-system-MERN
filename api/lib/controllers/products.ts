import express from 'express';
import Joi from 'joi';

import asyncHandler from '../utils/async-handler';
import { ProductServiceFactory } from '../services/products';
import { permissions } from 'lib/utils/permissions';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { InvalidPayload } from 'lib/middlewares/exception';

const router = express.Router();

const path = '/products';

const dealsPermissions = permissions.deals;

router.get(
  path,
  permissionsValidator(dealsPermissions.view),
  asyncHandler(async (req, res) => {
    const service = ProductServiceFactory(req.user);
    const product = await service.getProducts(req.query);

    res.json(product);
  })
);

const productValidator = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number(),
  category: Joi.string(),
  unit: Joi.number(),
});

router.post(
  path,
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const { error } = productValidator.validate(req.body);
    if (error) new InvalidPayload(error.message);

    const service = ProductServiceFactory(req.user);
    const product = await service.createProduct(req.body);

    res.json({ product });
  })
);

router.put(
  `${path}/:id`,
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const { error } = productValidator.validate(req.body);
    if (error) new InvalidPayload(error.message);

    const { id } = req.params;
    const service = ProductServiceFactory(req.user);
    const product = await service.updateProduct(id, req.body);

    res.json({ product });
  })
);

router.delete(
  `${path}/:id`,
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const service = ProductServiceFactory(req.user);
    const product = await service.removeProduct(id);

    res.json({ product });
  })
);

router.get(
  `${path}/:id/deals`,
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const service = ProductServiceFactory(req.user);
    const deals = await service.getDealsByProductId(id);

    res.json(deals);
  })
);

export default router;
