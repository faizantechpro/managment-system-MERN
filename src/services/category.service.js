import axios from 'axios';

import authHeader from './auth-header';

const API_URL = '/api/categories';

class CategoryService {
  async request(path, method = 'GET', body = '') {
    const opts = {
      method: method,
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    if (body !== '') {
      opts.body = JSON.stringify(body);
    }

    return fetch(path, opts);
  }

  async GetCategories(queryFilter, { page = 1, limit = 10, extraData }) {
    const { filter, ...restProps } = queryFilter || {};

    const params = {
      ...restProps,
      ...filter,
      page,
      limit,
      extraData,
    };

    return axios
      .get('/api/categories', {
        params,
        headers: authHeader(),
      })
      .then((response) => response.data);
  }

  async GetCategoryById(id) {
    const url = `/api/categories/${id}`;
    const resp = await this.request(url);
    return Promise.resolve(resp.json());
  }

  async CreateCategory(body) {
    const url = `/api/categories`;
    const response = await this.request(url, 'POST', body);
    return Promise.resolve(response.json());
  }

  async UpdateCategory(body) {
    const { id, ...rest } = body;
    const url = `/api/categories/${id}`;
    const response = await this.request(url, 'PUT', rest);
    return Promise.resolve(response.json());
  }

  async GetLessonsByCategory({ id, page = 1, limit = 10, ...rest }) {
    const resp = await axios.get(`${API_URL}/${id}/lessons`, {
      headers: authHeader(),
      params: {
        ...rest,
        page,
        limit,
      },
    });

    return resp.data;
  }

  getCoursesByCategory(id, { page = 1, limit = 10, ...rest }) {
    return axios
      .get(`${API_URL}/${id}/courses`, {
        headers: authHeader(),
        params: {
          page,
          limit,
          ...rest,
        },
      })
      .then((resp) => resp.data);
  }

  deleteCategory(categoryId) {
    return axios
      .delete(`${API_URL}/${categoryId}`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data;
      });
  }
}

export default new CategoryService();
