import authHeader from './auth-header';
import BaseRequestService from './baseRequest.service';

const API_URL = '/api/naics';

class NaicsService extends BaseRequestService {
  async getNaicsRpmgSummary(code) {
    return await this.get(
      `${API_URL}/${code}/rpmg/summary`,
      {
        headers: authHeader(),
      },
      { fullResponse: true }
    ).then((response) => response.data);
  }

  async getNaicsSpSummary(code) {
    return await this.get(
      `${API_URL}/${code}/sp/summary`,
      {
        headers: authHeader(),
      },
      { fullResponse: true }
    ).then((response) => response.data);
  }
}

export default new NaicsService();
