import axios from 'axios';

import authHeader from './auth-header';

const API_URL = '/api/notifications/settings';

class NotificationService {
  getSettings() {
    return axios
      .get(`${API_URL}`, { headers: authHeader() })
      .then((response) => {
        return response.data;
      });
  }

  addSettings(settings) {
    return axios
      .post(`${API_URL}`, { settings }, { headers: authHeader() })
      .then((response) => {
        return response.data;
      });
  }
}

export default new NotificationService();
