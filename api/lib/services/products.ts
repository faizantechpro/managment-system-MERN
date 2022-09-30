import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import { Product, Tenant } from '../database';
import {
  ProductsAttributes,
  ProductsModel,
} from 'lib/database/models/products';
import { UserContext } from 'lib/middlewares/openapi';
import ContextQuery from './utils/ContextQuery';

interface IQueryProduct {
  search?: string;
  page?: number;
  limit?: number;
  name?: {
    [Op.iLike]?: string;
  };
}

abstract class ProductService extends ContextQuery<ProductsModel> {
  async getProducts(query: IQueryProduct) {
    const { search, page = 1, limit = 10, ...restProps } = query || {};

    let querySearch = {
      ...restProps,
    };

    if (search) {
      querySearch = {
        ...restProps,
        name: { [Op.iLike]: `%${search}%` },
      };
    }

    const products = await Product.findAndCountAll({
      where: { ...querySearch, ...this.getContextQuery(), deleted: false },
      limit,
      include: [{ model: Tenant, as: 'tenant', attributes: ['id', 'name'] }],
      offset: limit * (page - 1),
      order: [['updated_at', 'DESC']],
    });

    const dataCount = products.count;

    return {
      products: products.rows,
      pagination: {
        limit: Number(limit),
        page: Number(page),
        totalPages: Math.ceil(dataCount / limit),
        count: dataCount,
      },
    };
  }

  async createProduct(newProduct: ProductsAttributes) {
    return await Product.create({
      id: uuidv4(),
      ...newProduct,
      tenant_id: this.user.tenant,
    });
  }

  async updateProduct(id: string, newProduct: ProductsAttributes) {
    return await Product.update(
      { ...newProduct },
      { where: { id, ...this.getContextQuery() } }
    );
  }

  async removeProduct(id: string) {
    return await Product.update(
      { deleted: true },
      { where: { id, ...this.getContextQuery() } }
    );
  }

  async getDealsByProductId(productId: string) {
    const result = await Product.findOne({
      where: { id: productId, ...this.getContextQuery() },
      include: ['deals'],
    });

    const product = result?.toJSON() as any;

    return product?.deals || [];
  }
}

export class AdminProductService extends ProductService {
  getContextQuery() {
    return {};
  }
}

export class OwnerProductService extends ProductService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export class UserProductService extends ProductService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export const ProductServiceFactory = (user = {} as UserContext) => {
  if (user.auth?.isAdmin) {
    return new AdminProductService(Product, user);
  } else if (user.auth?.isOwner) {
    return new OwnerProductService(Product, user);
  }

  return new UserProductService(Product, user);
};
