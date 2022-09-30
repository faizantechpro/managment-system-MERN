import axios from 'axios';

import authHeader from './auth-header';

const API_URL = '/api/activity';

class ActivityContactService {
  getActivityContacts(activityId) {
    return axios
      .get(`${API_URL}/${activityId}/contacts`, { headers: authHeader() })
      .then((response) => {
        return response.data;
      });
  }
}

export default new ActivityContactService();
