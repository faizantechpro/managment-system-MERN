import axios from 'axios';

import authHeader from './auth-header';

const API_URL = '/api/tenants';

class TenantService {
  getTenant() {
    return axios
      .get(`${API_URL}`, { headers: authHeader() })
      .then((response) => {
        return response.data;
      });
  }

  getTenants({ search = '' }, { limit = 10, page = 1 }) {
    return axios
      .get(`/api/tenants/all`, {
        params: { search, limit, page },
        headers: authHeader(),
      })
      .then((response) => {
        return response.data;
      });
  }

  getTenantBySubdomain(domain) {
    return axios
      .get(`/api/tenants/subdomains/${domain}`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => console.log(err));
  }

  updateTenant(tenant) {
    return axios
      .put(`${API_URL}`, { tenant }, { headers: authHeader() })
      .then((response) => {
        return response.data;
      });
  }
}

export default new TenantService();
