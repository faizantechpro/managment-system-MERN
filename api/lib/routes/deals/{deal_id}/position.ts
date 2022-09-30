import {
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
} from 'lib/middlewares/openapi';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { dealServiceFactory } from 'lib/services';
import { permissions } from 'lib/utils/permissions';

const dealsPermissions = permissions.deals;

export const PUT = operationMiddleware(
  'updateDealsPosition',
  {
    operationId: 'updateDealsPosition',
    summary: 'Update the deals position',
    tags: ['deals'],
    security: [{ Bearer: [] }],
    parameters: [
      {
        in: 'path',
        name: 'deal_id',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        required: ['update_deal'],
        properties: {
          deal_type: {
            type: 'string',
          },
          update_deal: {
            type: 'array',
            additionalProperties: false,
            items: {
              type: 'object',
              required: ['type', 'tenant_deal_stage_id', 'limit', 'position'],
              properties: {
                type: {
                  type: 'string',
                },
                position: {
                  type: 'number',
                },
                tenant_deal_stage_id: {
                  type: 'string',
                },
                origin: {
                  type: 'number',
                },
                destination: {
                  type: 'boolean',
                },
                limit: {
                  type: 'number',
                },
              },
            },
          },
          sales_stage: {
            type: 'string',
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema({
        type: 'object',
        properties: {},
      }),
    },
  },

  permissionsValidator(dealsPermissions.create) as any,
  async (req, res) => {
    const {
      params: { deal_id },
      body: { update_deal, ...body },
    } = req;

    const service = dealServiceFactory(req.user);
    await service.updatePositionDeals(deal_id, update_deal, body);

    return res.json({});
  }
);
