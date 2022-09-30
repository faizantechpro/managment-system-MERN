import axios from 'axios';

import authHeader from './auth-header';

const API_USERS_URL = '/api/search';

class SearchService {
  async getSearchResults(searchQuery) {
    const { s } = searchQuery || {};

    const params = {
      s,
    };

    return axios
      .get(API_USERS_URL, {
        params,
        headers: authHeader(),
      })
      .then((response) => response);
  }
}

export default new SearchService();
