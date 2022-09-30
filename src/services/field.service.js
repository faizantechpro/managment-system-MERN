import axios from 'axios';

import authHeader from './auth-header';

const API_URL_ORGANIZATION = '/api/organizations/fields';
const API_URL = '/api/fields';
const API_URL_CONTACT = '/api/contacts/fields';

class FieldService {
  getOptions() {
    return axios
      .get(`${API_URL}/options`, {
        headers: authHeader(),
      })
      .then((response) => response)
      .catch((err) => {
        console.log(err);
      });
  }

  getFieldsByType(type, { page = 1, limit = 10 }) {
    const URL =
      type === 'organization' ? API_URL_ORGANIZATION : API_URL_CONTACT;

    return axios
      .get(URL, {
        params: { page, limit },
        headers: authHeader(),
      })
      .then((response) => response)
      .catch((err) => {
        console.log(err);
      });
  }

  getFieldById(type, fieldId) {
    const URL =
      type === 'organization' ? API_URL_ORGANIZATION : API_URL_CONTACT;

    return axios
      .get(`${URL}/${fieldId}`, {
        headers: authHeader(),
      })
      .then((response) => response)
      .catch((err) => {
        console.log(err);
      });
  }

  upsetFieldByType(data, type) {
    const URL =
      type === 'organization' ? API_URL_ORGANIZATION : API_URL_CONTACT;

    return axios
      .put(
        URL,
        {
          ...data,
        },
        {
          headers: authHeader(),
        }
      )
      .then((response) => response);
  }

  removeFieldByType(id, type) {
    const URL =
      type === 'organization' ? API_URL_ORGANIZATION : API_URL_CONTACT;

    return axios
      .delete(`${URL}/${id}`, {
        headers: authHeader(),
      })
      .then((response) => response)
      .catch((err) => {
        console.log(err);
      });
  }
}

export default new FieldService();
