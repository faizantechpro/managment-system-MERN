import authHeader from './auth-header';
import axios from 'axios';

export class API {
  constructor() {
    this.headers = authHeader();
    this.headers['Content-Type'] = 'application/json';
  }

  async request(path, method = 'GET', body = '') {
    const opts = {
      method: method,
      headers: this.headers,
    };

    if (body !== '') {
      opts.body = JSON.stringify(body);
    }

    return fetch(path, opts);
  }

  async CreateCategory(body) {
    const url = `/api/categories`;
    const response = await this.request(url, 'POST', body);
    return Promise.resolve(response.json());
  }

  async GetUserInfo() {
    const resp = await this.request('/api/users/me');
    return Promise.resolve(resp.json());
  }

  async GetTotalPoints(filter) {
    return axios
      .get('/api/lessons/overview', {
        headers: authHeader(),
        params: {
          ...filter,
        },
      })
      .then((response) => response.data)
      .catch((e) => console.log(e));
  }

  async GetLessons({ page = 1, limit = 10, ...rest }) {
    return axios
      .get('/api/lessons', {
        headers: authHeader(),
        params: {
          page,
          limit,
          ...rest,
        },
      })
      .then((response) => response.data)
      .catch((e) => console.log(e));
  }

  async GetLessonById(id) {
    const resp = await this.request(`/api/lessons/${id}`);
    return Promise.resolve(resp.json());
  }

  async TrackLesson(id, data) {
    const body = {
      page_id: data.pageId,
      is_first: data.isFirst,
      is_last: data.isLast,
      progress: data.progress,
      points: data.points,
      attempts: data.attempts,
    };

    const resp = await this.request(`/api/lessons/${id}/track`, 'POST', body);

    return Promise.resolve(resp.json());
  }
}
