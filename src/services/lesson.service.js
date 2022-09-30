import axios from 'axios';

import authHeader from './auth-header';

const API_URL = '/api/lessons';
const STORAGE_KEY = 'idftoken';

class LessonService {
  GetLessonsByCatId(catId, search = '', page = 1, limit = 10) {
    const params = {
      page,
      limit,
    };

    if (search?.trim() !== '') {
      params.search = search;
    }

    return axios
      .get(`/api/categories/${catId}/lessons`, {
        params,
        headers: authHeader(),
      })
      .then((response) => {
        return response.data;
      });
  }

  GetSummary(userId) {
    return axios
      .get(API_URL + '/overview', { headers: authHeader(), params: { userId } })
      .then((response) => {
        return response.data;
      });
  }

  async getRelatedLessons() {
    const result = await axios.get(`${API_URL}/related`, {
      headers: authHeader(),
    });
    return result.data;
  }

  GetLessonTrackByLessonId(id) {
    const { access_token } = JSON.parse(localStorage.getItem(STORAGE_KEY));

    return axios
      .get(API_URL + `/${id}/track`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => response.data);
  }

  PutFavoriteByLessonId({ id }) {
    const { access_token } = JSON.parse(localStorage.getItem(STORAGE_KEY));

    return axios
      .put(
        API_URL + `/${id}/favorite`,
        { lessonId: id },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((response) => response.data);
  }

  SubmitAnswer(lessonId, pageId, answer) {
    return axios
      .post(
        API_URL + `/${lessonId}/pages/${pageId}/check`,
        { answer: answer },
        { headers: authHeader() }
      )
      .then((response) => response.data);
  }

  PdfLinkByLesson(fileId) {
    return axios
      .get(`/api/assets/${fileId}`, {
        params: {
          from: 'lesson',
        },
        headers: authHeader(),
        responseType: 'blob',
      })
      .then((response) => response.data);
  }

  createUpdateLesson(data) {
    const { access_token } = JSON.parse(localStorage.getItem(STORAGE_KEY));

    return axios
      .put(`/api/lessons`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => response)
      .catch((e) => console.log(e));
  }

  createUpdatePages(id, pages, removePages) {
    const { access_token } = JSON.parse(localStorage.getItem(STORAGE_KEY));

    return axios
      .put(
        `/api/lessons/${id}/pages`,
        {
          pages,
          removePages,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((response) => response);
  }

  GetLessonTracked(id) {
    return axios
      .get(`${API_URL}/${id}/tracked`, {
        headers: authHeader(),
      })
      .then((response) => response.data);
  }

  deleteLesson(id) {
    return axios
      .put(`${API_URL}/${id}`, id, {
        headers: authHeader(),
      })
      .then((response) => response);
  }
}

export default new LessonService();
