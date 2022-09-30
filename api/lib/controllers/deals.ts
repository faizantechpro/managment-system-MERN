import express from 'express';
import Joi from 'joi';

import asyncHandler from '../utils/async-handler';
import { dealServiceFactory } from '../services/deal';
import {
  DealFollowerService,
  DealOwnerService,
  contactServiceFactory,
  organizationServiceFactory,
  activityServiceFactory,
} from '../services';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { permissions } from 'lib/utils/permissions';
import {
  principalOwnerValidator,
  dealProductValidator,
} from 'lib/middlewares/ownerValidator';
import { dealProductServiceFactory } from 'lib/services/deal';
import { InvalidPayload, ResourceNotFound } from 'lib/middlewares/exception';
import { ContextMiddleware } from 'lib/middlewares/context';

const router = express.Router();

const path = '/deals';

const dealsSchema = Joi.object({
  deleted: false,
  id: Joi.string().uuid({ version: 'uuidv4' }).optional(),
  assigned_user_id: Joi.string().allow(null).optional(),
  created_by: Joi.string().optional(),
  modified_user_id: Joi.string().allow(null).optional(),
  name: Joi.string().required(),
  description: Joi.string().allow(null).optional(),
  tenant_deal_stage_id: Joi.string().required(),
  lead_source: Joi.string().allow(null).optional(),
  amount: Joi.string().allow(null).optional(),
  currency: Joi.string().allow(null).optional(),
  date_closed: Joi.string().allow(null).optional(),
  next_step: Joi.string().allow(null).optional(),
  sales_stage: Joi.string().allow(null).optional(),
  probability: Joi.string().allow(null).optional(),
  contact_person_id: Joi.string().allow(null).optional(),
  contact_organization_id: Joi.string().allow(null).optional(),
  contact_organization_new: Joi.string().allow(null).optional(),
  contact_person_new: Joi.string().allow(null).optional(),
  products: Joi.array().allow(null).optional(),
});

const dealsPermissions = permissions.deals;

router.get(
  path,
  permissionsValidator(dealsPermissions.view),
  asyncHandler(async (req, res) => {
    const { page, limit, recent_activity, ...query } = req.query as any;

    const summary = await await (
      req as unknown as ContextMiddleware
    ).services.biz.deal.findAllAsStageSummary(undefined, query as any);

    // can't type to boolean....
    if (recent_activity === 'true') {
      const deals = await (
        req as unknown as ContextMiddleware
      ).services.biz.dealFeed.getAsRecentlyViewed(
        undefined,
        { limit, page },
        { ...query }
      );

      return res.json({
        pagination: deals.pagination,
        deals: deals.data,
        summary,
      });
    }

    const service = dealServiceFactory(req.user);

    const listDeals = await service.getDeals(req.query);
    const { deals, pagination } = listDeals;

    const dealService = new DealOwnerService(req.user);
    const dealsWithActivities = await Promise.all(
      deals?.map(async (deal: any) => {
        const owners = await dealService.getOwners(deal.id, {
          limit: 20,
          page: 1,
        });

        const activityService = activityServiceFactory(req.user);
        const listActivities = await activityService.getActivities({
          organizationId: deal.organization?.id || null,
          dealId: deal.id,
          done: false,
          oldest: false,
        });
        return {
          ...deal.dataValues,
          activities: listActivities.activities,
          owners: owners?.data,
        };
      })
    );

    res.json({
      pagination,
      deals: dealsWithActivities,
      summary,
    });
  })
);

router.get(
  `${path}/overall`,
  permissionsValidator(dealsPermissions.view),
  asyncHandler(async (req, res) => {
    const service = dealServiceFactory(req.user);

    const overall = await service.getOverall();

    res.json(overall);
  })
);

router.get(
  `${path}/:id`,
  permissionsValidator(dealsPermissions.view),
  asyncHandler(async (req, res, next) => {
    // TODO migrate this to openapi and it won't be an issue.... i hate this :(
    if (req.params.id === 'owners') {
      return next();
    }

    const { id } = req.params;

    const service = dealServiceFactory(req.user);
    const deals = await service.getDealById(id);

    res.json(deals);
  })
);

router.post(
  path,
  permissionsValidator(dealsPermissions.create),
  asyncHandler(async (req, res) => {
    const { error } = dealsSchema.validate(req.body);

    if (error) throw new InvalidPayload(error.message);

    const {
      assigned_user_id,
      products,
      sales_stage,
      contact_organization_id,
      contact_organization_new,
      contact_person_id,
      contact_person_new,
      tenant_deal_stage_id,
      ...rest
    } = req.body;

    if (!contact_organization_id && !contact_organization_new) {
      throw new InvalidPayload('Bad Request');
    }

    let organizationId = contact_organization_id;
    let contactId = contact_person_id;

    if (!contact_organization_id) {
      const data = {
        name: contact_organization_new,
        date_entered: new Date(),
        date_modified: new Date(),
        created_by: req.user.id,
        modified_user_id: req.user.id,
        assigned_user_id: req.user.id,
        address_country: 'USA',
        tenant_id: req.user.tenant,
      };

      const service = organizationServiceFactory(req.user);
      const organization = await service.createOrganization(data);

      organizationId = organization.id;
    }

    if (contact_person_new && contact_person_new?.trim() !== '') {
      const fullName = contact_person_new.split(' ');

      let firstName = fullName[0];
      let lastName = fullName?.[1] || '';

      if (fullName.length === 3) {
        lastName = `${fullName[1]} ${fullName[2]}`;
      }

      if (fullName.length >= 4) {
        lastName = `${fullName[2]} ${fullName[3]}`;
        firstName = `${fullName[0]} ${fullName[1]}`;
      }

      const data = {
        first_name: firstName,
        last_name: lastName,
        created_by: req.user.id,
        modified_user_id: req.user.id,
        assigned_user_id: assigned_user_id || req.user.id,
        date_entered: new Date(),
        date_modified: new Date(),
        tenant_id: req.user.tenant,
      };

      const service = contactServiceFactory(req.user);
      const contact = await service.createContact(data);

      contactId = contact?.dataValues.id;

      await service.linkOrganization(contactId, organizationId);
    }

    const data = {
      ...rest,
      contact_organization_id: organizationId,
      contact_person_id: contactId,
      date_entered: new Date(),
      date_modified: new Date(),
      created_by: req.user.id,
      modified_user_id: req.user.id,
      assigned_user_id: assigned_user_id || req.user.id,
      tenant_deal_stage_id: tenant_deal_stage_id,
      sales_stage: sales_stage || 'cold',
      tenant_id: req.user.tenant,
    };

    const service = dealServiceFactory(req.user);
    const dealProductService = dealProductServiceFactory(req.user);
    const deal = await service.createDeal(data);

    try {
      const dealProducts =
        products && products.length
          ? await dealProductService.bulkCreate(deal.id, products, {
              deleteStale: true,
            })
          : [];

      return res.json({
        ...deal,
        deal_products: dealProducts,
      });
    } catch (error) {
      return res.status(error.status).json(error.message);
    }
  })
);

router.get(
  `${path}/:deal_id/product/:product_id`,
  permissionsValidator(dealsPermissions.view),
  asyncHandler(async (req, res) => {
    const service = dealProductServiceFactory(req.user);
    const deals = await service.getByQuery(req.params as any);
    res.json(deals);
  })
);

router.delete(
  `${path}/products/:dealProductId`,
  permissionsValidator(dealsPermissions.delete),
  asyncHandler(async (req, res) => {
    const { dealProductId } = req.params;

    if (!req.user.admin) {
      await dealProductValidator({ user: req.user, id: dealProductId });
    }

    const service = dealProductServiceFactory(req.user);
    const totalDeleted = await service.deleteOne(dealProductId);
    if (!totalDeleted) {
      throw new ResourceNotFound('DealProduct');
    }

    res.json({});
  })
);

router.patch(
  `${path}/:id`,
  permissionsValidator(dealsPermissions.create),
  asyncHandler(async (req, res) => {
    const {
      params: { id },
      body,
    } = req;

    if (!req.user.admin && !req.user.owner) {
      await principalOwnerValidator({ user: req.user, id });
    }

    const service = dealServiceFactory(req.user);

    const dealUpdate = await service.updateOne(id, body);
    res.json(dealUpdate);
  })
);

router.patch(
  `${path}/:dealId/products`,
  permissionsValidator(dealsPermissions.create),
  asyncHandler(async (req, res) => {
    const {
      params: { dealId },
      body,
    } = req;

    if (!req.user.admin) {
      await principalOwnerValidator({ user: req.user, id: dealId });
    }

    const service = dealServiceFactory(req.user);
    const dealProductService = dealProductServiceFactory(req.user);

    await service.updateOne(dealId, body);

    try {
      const dealProductsUpdated =
        body.products && body.products.length
          ? await dealProductService.bulkUpsert(dealId, body.products)
          : [];

      return res.json(dealProductsUpdated);
    } catch (error: any) {
      return res.status(error.status).json(error.message);
    }
  })
);

router.get(
  `${path}/:deal_id/followers`,
  permissionsValidator(dealsPermissions.view),
  async (req, res) => {
    const {
      user,
      params: { deal_id },
      query: { page, limit, ...rest },
    } = req;

    const service = new DealFollowerService(user);
    const followers = await service.getFollowers(
      deal_id,
      {
        page: page as any,
        limit: limit as any,
      },
      rest
    );

    return res.json(followers);
  }
);

router.get(
  `${path}/:deal_id/followers/:user_id`,
  permissionsValidator(dealsPermissions.view),
  async (req, res) => {
    const {
      user,
      params: { deal_id, user_id },
    } = req;

    const service = new DealFollowerService(user);
    const isFollower = await service.isFollower(deal_id, user_id);

    return res.json({ isFollower });
  }
);

router.post(
  `${path}/:deal_id/followers/:user_id`,
  permissionsValidator(dealsPermissions.create),
  async (req, res) => {
    const {
      user,
      params: { deal_id, user_id },
    } = req;

    const service = new DealFollowerService(user);
    await service.startFollowing(deal_id, user_id);

    res.json({});
  }
);

router.delete(
  `${path}/:deal_id/followers/:user_id`,
  permissionsValidator(dealsPermissions.delete),
  async (req, res) => {
    const {
      user,
      params: { deal_id, user_id },
    } = req;

    const service = new DealFollowerService(user);
    await service.stopFollowing(deal_id, user_id);

    res.json({});
  }
);

router.get(
  `${path}/status/summary`,
  permissionsValidator(dealsPermissions.view),
  async (req, res) => {
    const service = dealServiceFactory(req.user);
    const summary = await service.getDealsStatus();
    return res.json({ summary });
  }
);

router.patch(
  `${path}/status/:deal_id`,
  permissionsValidator(dealsPermissions.create),
  async (req, res) => {
    const {
      user,
      params: { deal_id },
      body: { status },
    } = req;
    const service = dealServiceFactory(user);
    await service.setDealStatus(deal_id, status);
    return res.json({ message: 'status updated successfully' });
  }
);

router.post(
  `${path}/stages/bulk`,
  permissionsValidator(dealsPermissions.create),
  async (req, res) => {
    const {
      user,
      body: { data },
    } = req;
    const service = dealServiceFactory(user);
    const dataWithTenant = data.map((deal: any) => ({
      ...deal,
      tenant_id: user.tenant,
    }));
    const deals = await service.updateDealsStages(dataWithTenant);
    return res.json(deals);
  }
);

export default router;
