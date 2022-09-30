import axios from 'axios';
import fileDownload from 'js-file-download';

import authHeader from './auth-header';

const API_URL = '/api';
const API_URL_ORG = API_URL + '/organizations';

class ReportService {
  createLeadReport(organizationId, payload) {
    return axios
      .post(`${API_URL_ORG}/${organizationId}/reports`, payload, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data;
      });
  }

  async updateLeadReport(organizationId, reportId, payload) {
    return await axios
      .put(`${API_URL_ORG}/${organizationId}/reports/${reportId}`, payload, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getLeadReport(organizationId, type) {
    return axios
      .get(`${API_URL_ORG}/${organizationId}/reports`, {
        headers: authHeader(),
        params: { page: 1, limit: 10 },
      })
      .then((response) => {
        return response.data;
      });
  }

  async getMerchantReport(mid, dateFrom, dateTo) {
    return axios
      .get(`${API_URL}/merchantReport/${mid}`, {
        headers: authHeader(),
        params: { fromDate: dateFrom, toDate: dateTo },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async sendReportToEmail(dataReportToSend) {
    return axios
      .post(`${API_URL_ORG}/reports/share`, dataReportToSend, {
        headers: {
          ...authHeader(),
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async downloadReport(id, fileName, organizationId, createFeed) {
    const downloadLink = `${API_URL_ORG}/${organizationId}/reports/download/${id}${
      createFeed === false ? `?createFeed=false` : ''
    }`;

    return axios
      .get(downloadLink, {
        headers: {
          ...authHeader(),
        },
        responseType: 'blob',
      })
      .then((response) => {
        fileDownload(response.data, fileName);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

export default new ReportService();
