import axios from 'axios';

import authHeader from './auth-header';

const API_URL = '/api/badges';
class BadgeService {
  getBadges({ page, limit, search, filters, order }) {
    return axios
      .get(API_URL, {
        params: { page, limit, search, order, ...filters },
        headers: authHeader(),
      })
      .then((response) => response.data);
  }

  getBadge(id) {
    return axios
      .get(`${API_URL}/${id}`, {
        headers: authHeader(),
      })
      .then((response) => response.data);
  }

  updateBadge(id, body) {
    return axios.put(`${API_URL}/${id}`, body, {
      headers: authHeader(),
    });
  }

  deleteBadge(id) {
    return axios
      .delete(`${API_URL}/${id}`, {
        headers: authHeader(),
      })
      .then((response) => response.data);
  }

  createBadge(body) {
    return axios.post(API_URL, body, { headers: authHeader() });
  }
}

export default new BadgeService();
