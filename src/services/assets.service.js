import axios from 'axios';
import authHeader from './auth-header';
import FileDownload from 'js-file-download';

const API_URL = '/api/assets';

class AssetsService {
  async downloadFile(id, fileName, options) {
    return axios
      .get(`${API_URL}/${id}`, {
        headers: {
          ...authHeader(),
          'cache-control': 'no-cache',
        },
        responseType: 'blob',
        ...options,
      })
      .then((response) => {
        if (response?.response?.status === 403) {
          throw new Error(response);
        }

        FileDownload(response.data, fileName);
      });
  }
}

export default new AssetsService();
