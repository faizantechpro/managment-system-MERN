import axios from 'axios';

import authHeader from './auth-header';
import BaseRequestService from './baseRequest.service';

const API_URL = '/api/products';

class ProductService extends BaseRequestService {
  async getProducts(queryFilter, { page = 1, limit = 10 }) {
    const { filter, ...restProps } = queryFilter || {};

    const params = {
      ...restProps,
      ...filter,
      page,
      limit,
    };

    return await this.get(
      API_URL,
      {
        params,
        headers: authHeader(),
      },
      { fullResponse: true }
    );
  }

  getProductsDeals(id, { page = 1, limit = 10 }) {
    const params = {
      page,
      limit,
    };

    return axios
      .get(`${API_URL}/${id}/deals`, {
        params,
        headers: authHeader(),
      })
      .then((response) => response);
  }

  saveProduct(product) {
    return axios
      .post(API_URL, product, { headers: authHeader() })
      .then((response) => response);
  }

  updateProduct(id, product) {
    return axios
      .put(`${API_URL}/${id}`, product, { headers: authHeader() })
      .then((response) => response);
  }

  deleteProduct(id) {
    return axios
      .delete(`${API_URL}/${id}`, { headers: authHeader() })
      .then((response) => response);
  }
}

export default new ProductService();
