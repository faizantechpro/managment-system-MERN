import { ownerBizFactory } from 'lib/biz';
import { operationMiddleware } from '../../../utils/operation';
import { generateGetAssociatedOwners, GenericResourceTypeOp } from '../schemas';
import { isGenericOpenAPIRequest } from '../types';

const isContactRequest = isGenericOpenAPIRequest('getAssociatedContactOwners');
const isDealRequest = isGenericOpenAPIRequest('getAssociatedDealOwners');
const isOrganizationRequest = isGenericOpenAPIRequest(
  'getAssociatedOrganizationOwners'
);

export function getAssociatedOwners(op: GenericResourceTypeOp) {
  const generic = generateGetAssociatedOwners(op);

  return operationMiddleware(generic.opId, generic.schema, async (req, res) => {
    const {
      query: { limit, page },
    } = req;

    let biz: ReturnType<typeof ownerBizFactory> | undefined;

    if (isContactRequest(req)) {
      biz = req.services.biz.contactOwner;
    } else if (isDealRequest(req)) {
      biz = req.services.biz.dealOwner;
    } else if (isOrganizationRequest(req)) {
      biz = req.services.biz.organizationOwner;
    }

    if (!biz) {
      throw new Error('invalid resource');
    }

    const owners = await biz.getByParent(undefined, { limit, page });

    return res.success(owners);
  });
}
