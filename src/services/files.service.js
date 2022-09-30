import axios from 'axios';
import authHeader from './auth-header';

const API_URL = '/api/files';

class FilesService {
  uploadFile(body, isPublic = false) {
    return axios
      .post(API_URL, body, {
        headers: {
          ...authHeader(),
        },
        params: {
          public: isPublic,
        },
      })
      .then((response) => response.data);
  }

  removeFile(id) {
    return axios
      .delete(`${API_URL}/${id}/activity`, { headers: authHeader() })
      .then((res) => {
        if (res.response.status === 403 || res.response.status === 404) {
          return res;
        }

        return res.data;
      });
  }

  renameFile(id, name) {
    return axios
      .put(
        `${API_URL}/${id}/activity`,
        { name },
        {
          headers: {
            ...authHeader(),
          },
        }
      )
      .then((response) => response.data);
  }

  getFile(id) {
    return axios
      .get(`${API_URL}/${id}`, { headers: authHeader() })
      .then((res) => res.data);
  }

  removeFileById(id) {
    return axios
      .delete(`${API_URL}/${id}`, { headers: authHeader() })
      .then((res) => res.data);
  }
}

export default new FilesService();
