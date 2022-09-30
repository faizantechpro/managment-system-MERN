import { DealProduct } from 'lib/database';
import {
  DealProductsModel,
  DealProductsModifyAttributes,
} from 'lib/database/models/deal';
import { AuthUser } from 'lib/middlewares/auth';
import { differenceBy } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import Base, { SequelizeOpts } from '../utils/Base';

class DealProductService extends Base<DealProductsModel> {
  async getByDealId(dealId: string) {
    const dealProducts = await this.model.findAll({
      where: {
        deal_id: dealId,
      },
    });

    return this.rowsToJSON(dealProducts);
  }

  async getByQuery(query: { deal_id?: string; product_id?: string }) {
    const where = this.getWhere();
    if (query.deal_id) {
      where.deal_id = query.deal_id;
    }
    if (query.product_id) {
      where.product_id = query.product_id;
    }

    const dealProducts = await this.model.findAll({
      where,
    });

    return this.rowsToJSON(dealProducts);
  }

  async getOne(id: string) {
    const dealProduct = await this.model.findOne({
      where: {
        id,
      },
    });

    return dealProduct?.toJSON();
  }

  async bulkCreate(
    dealId: string,
    payloads: DealProductsModifyAttributes[] = [],
    opts: { deleteStale: boolean }
  ) {
    const bulkPayload = payloads.map((payload) => ({
      id: uuidv4(),
      ...payload,
      deal_id: dealId,
    }));

    const dealProducts = await this.model.bulkCreate(bulkPayload);

    if (opts.deleteStale) {
      await this.bulkDeleteStale(dealId, dealProducts);
    }

    return dealProducts.map((dealProduct) => dealProduct.toJSON());
  }

  async bulkUpsert(
    dealId: string,
    payloads: DealProductsModifyAttributes[] = []
  ) {
    const newProducts = payloads.filter(({ id }) => !id);
    const updatedProducts = payloads.filter(({ id }) => !!id);

    const [newDealProducts, ...upsertedDealProducts] = await Promise.all([
      this.bulkCreate(dealId, newProducts, { deleteStale: false }),
      ...updatedProducts.map(async (product) => {
        const [upsertedDealProduct] = await this.model.upsert(product);
        return upsertedDealProduct;
      }),
    ]);

    return [
      ...newDealProducts,
      ...upsertedDealProducts.map((dealProduct) => dealProduct.toJSON()),
    ];
  }

  async bulkDeleteStale(
    dealId: string,
    products: Awaited<ReturnType<DealProductService['bulkCreate']>>
  ) {
    if (!products.length) {
      return 0;
    }

    const allProducts = await this.getByDealId(dealId);
    const staleIds = differenceBy(allProducts, products, 'id').map(
      ({ id }) => id
    );

    let deleted = 0;
    if (staleIds.length > 0) {
      deleted = await this.delete(staleIds);
    }
    return deleted;
  }

  async delete(ids: string[]) {
    return this.defaultDeleteById(ids);
  }

  async deleteByDealId(dealId: string, opts: SequelizeOpts = {}) {
    const deleted = await this.model.destroy({
      where: {
        deal_id: dealId,
      },
      ...this.getSequelizeOpts(opts),
    });

    return deleted;
  }

  async deleteOne(id: string) {
    return this.defaultDeleteById(id);
  }
}

export function dealProductServiceFactory(user: AuthUser) {
  return new DealProductService(DealProduct, user);
}
