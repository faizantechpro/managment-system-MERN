import axios from 'axios';

import authHeader from './auth-header';

const API_URL = '/api/dashboards';

class DashboardService {
  getDashboards(page = 1, limit = 1000) {
    return axios
      .get(`${API_URL}`, {
        headers: authHeader(),
        params: { page, limit },
      })
      .then((response) => response)
      .catch((err) => {
        console.log(err);
      });
  }

  getDashboardsComponents(dashboardId, page = 1, limit = 1000) {
    return axios
      .get(`${API_URL}/${dashboardId}/components`, {
        headers: authHeader(),
        params: { page, limit },
      })
      .then((response) => response)
      .catch((err) => {
        console.log(err);
      });
  }
}

export default new DashboardService();
