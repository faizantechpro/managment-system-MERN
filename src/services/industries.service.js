import axios from 'axios';
import authHeader from './auth-header';

const API_URL = '/api/naics';

class IndustryService {
  getIndustries({ page = 1, limit = 10, search = '' }) {
    return axios
      .get(API_URL, {
        params: { page, limit, search },
        headers: authHeader(),
      })
      .then((response) => response)
      .catch((err) => {
        console.log(err);
      });
  }

  getIndustryByCode(id) {
    return axios
      .get(`${API_URL}/${id}`, { headers: authHeader() })
      .then((response) => response);
  }
}

export default new IndustryService();
