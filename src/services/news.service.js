import axios from 'axios';

import authHeader from './auth-header';

const API_URL = '/api/news';

class NewsService {
  async getNews(opts) {
    const params = opts;

    return axios
      .get(`${API_URL}`, {
        params,
        headers: authHeader(),
      })
      .then((response) => response)
      .catch((e) => console.log(e));
  }
}

export default new NewsService();
