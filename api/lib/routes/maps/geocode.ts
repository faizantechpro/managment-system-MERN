import {
  generateResponseSchema,
  operationMiddleware,
  schemas,
} from 'lib/middlewares/openapi';
import { AddressService } from 'lib/services';

export const GET = operationMiddleware(
  'getGoogleAddress',
  {
    operationId: 'getGoogleAddress',
    summary: 'Get Google Address',
    tags: ['provider'],
    security: [{ Bearer: [] }],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: [],
        properties: {
          address: schemas.googleAddress,
        },
      }),
    },
  },

  async (req, res) => {
    const service = new AddressService();

    const mapAddress = await service.getGoogleAddress({
      ...req.query,
    });

    return res.json(mapAddress);
  }
);
