import axios from 'axios';
import authHeader from './auth-header';
import BaseRequestService from './baseRequest.service';

const API_URL = '/api/labels';

class Labels extends BaseRequestService {
  async getLabels(type) {
    return axios
      .get(`${API_URL}`, {
        params: { type },
        headers: authHeader(),
      })
      .then((response) => response.data);
  }

  async createLabel(data) {
    return axios
      .post(`${API_URL}`, data, {
        headers: authHeader(),
      })
      .then((response) => response.data);
  }

  async editLabel(label_id, data) {
    return this.put(
      `${API_URL}/${label_id}`,
      data,
      {
        headers: authHeader(),
      },
      { fullResponse: false, errorsRedirect: true }
    );
  }

  async removeLabel(label_id) {
    return axios
      .delete(`${API_URL}/${label_id}`, {
        headers: authHeader(),
      })
      .then((response) => response.data);
  }
}

export default new Labels();
