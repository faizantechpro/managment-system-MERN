import {
  generateResponseSchema,
  parameters,
  responses,
} from 'lib/middlewares/openapi';
import { principalOwnerValidator } from 'lib/middlewares/ownerValidator';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { operationMiddleware } from 'lib/utils';
import { permissions } from 'lib/utils/permissions';

export const DELETE = operationMiddleware(
  'deleteDeal',
  {
    operationId: 'deleteDeal',
    summary: 'Delete a Deal',
    tags: ['deals'],
    security: [{ Bearer: [] }],
    parameters: [parameters.dealId],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        properties: {},
      }),
      404: responses.notFound.generate('Deal'),
    },
  },

  permissionsValidator(permissions.deals.delete) as any,
  async (req, res) => {
    const {
      params: { deal_id },
      user,
    } = req;

    if (!req.user.auth.isAdmin) {
      await principalOwnerValidator({ user, id: deal_id });
    }

    const deal = await req.services.data.deal.getDealById(deal_id);
    if (!deal.deal) {
      return res.error(404, { error: 'Deal not found' });
    }

    await req.services.data.deal.deleteOne(deal_id);

    return res.success({});
  }
);
