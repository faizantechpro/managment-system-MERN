import axios from 'axios';

import authHeader from './auth-header';

const API_URL = '/api/courses';
class CourseService {
  getCourses(query = {}) {
    const { page = 1, limit = 10, ...rest } = query;

    return axios
      .get(`${API_URL}`, {
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

  deleteCourses(coursesId) {
    return axios
      .delete(API_URL, {
        headers: authHeader(),
        data: {
          coursesId,
        },
      })
      .then((response) => response.data)
      .catch((e) => console.log(e));
  }

  updateCourse(id, data) {
    return axios
      .patch(`${API_URL}/${id}`, data, {
        headers: authHeader(),
      })
      .then((response) => response.data)
      .catch((e) => console.log(e));
  }

  saveCourseLessons(courseLesson) {
    return axios
      .post(
        API_URL,
        {
          ...courseLesson,
        },
        {
          headers: authHeader(),
        }
      )
      .then((response) => response.data)
      .catch((e) => console.log(e));
  }

  getCourseLessonsById(id) {
    return axios
      .get(`${API_URL}/${id}/lessons`, { headers: authHeader() })
      .then((response) => response.data)
      .catch((e) => console.log(e));
  }

  getCoursesCompleted(userId) {
    return axios
      .get(`${API_URL}/completed`, {
        headers: authHeader(),
        params: {
          userId,
        },
      })
      .then((response) => response.data)
      .catch((e) => console.log(e));
  }

  getCourseProgress(id) {
    return axios
      .get(`${API_URL}/${id}/progress`, { headers: authHeader() })
      .then((response) => response.data)
      .catch((e) => console.log(e));
  }

  getlessonCourseProgress(id, lessonIds) {
    return axios
      .get(`${API_URL}/${id}/lessons/progress`, {
        params: { lessonIds },
        headers: authHeader(),
      })
      .then((response) => response.data)
      .catch((e) => console.log(e));
  }

  start(id) {
    return axios
      .post(`${API_URL}/${id}/start`, {}, { headers: authHeader() })
      .then((response) => response.data)
      .catch((e) => console.log(e));
  }

  complete(id) {
    return axios
      .post(`${API_URL}/${id}/complete`, {}, { headers: authHeader() })
      .then((response) => response.data)
      .catch((e) => console.log(e));
  }

  updateCourseLessons(id, courseLesson) {
    return axios
      .put(
        `${API_URL}/${id}/lessons`,
        {
          ...courseLesson,
        },
        {
          headers: authHeader(),
        }
      )
      .then((response) => response.data)
      .catch((e) => console.log(e));
  }

  putFavoriteCourseById(id) {
    return axios
      .put(
        `${API_URL}/${id}/favorite`,
        { courseId: id },
        {
          headers: authHeader(),
        }
      )
      .then((response) => response.data)
      .catch((e) => console.log(e));
  }
}

export default new CourseService();
