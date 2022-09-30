import axios from 'axios';

import authHeader from './auth-header';

const API_URL = '/api/quizzes';

class QuizService {
  getQuizzes({ page, limit, search, filters, order, action }) {
    return axios
      .get(API_URL, {
        params: { page, limit, search, order, action, ...filters },
        headers: authHeader(),
      })
      .then((response) => response.data);
  }

  getQuiz(id) {
    return axios
      .get(`${API_URL}/${id}`, {
        headers: authHeader(),
      })
      .then((response) => response.data);
  }

  deleteQuiz(id) {
    return axios
      .delete(`${API_URL}/${id}`, {
        headers: authHeader(),
      })
      .then((response) => response.data);
  }

  createUpdateQuiz(data) {
    return axios
      .put(API_URL, data, {
        headers: authHeader(),
      })
      .then((response) => response);
  }

  createUpdatePages(id, pages, removePages) {
    return axios
      .put(
        `${API_URL}/${id}/pages`,
        { pages, removePages },
        { headers: authHeader() }
      )
      .then((response) => response);
  }

  finishTakeQuiz(id, answers) {
    return axios
      .post(
        `${API_URL}/${id}/submissions`,
        { answers },
        {
          headers: authHeader(),
        }
      )
      .then((response) => response)
      .catch((e) => console.log(e));
  }

  getQuizSubmissions(id) {
    return axios
      .get(`${API_URL}/${id}/submissions`, {
        params: { page: 1, limit: 10 },
        headers: authHeader(),
      })
      .then((response) => response.data)
      .catch((e) => console.log(e));
  }
}

export default new QuizService();
