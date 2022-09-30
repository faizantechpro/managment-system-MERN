import axios from 'axios';

import authHeader from './auth-header';
class PublicReportService {
  async getReport(organizationId) {
    return axios
      .get(`/api/organizations/${organizationId}/reports`, {
        params: {
          page: 1,
          limit: 10,
        },
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

  async shareReportToEmail(contactId, dataReportToSend) {
    return axios
      .post(`/api/contacts/${contactId}/guest`, dataReportToSend, {
        headers: {
          ...authHeader(),
        },
      })
      .then((sentReport) => {
        if (sentReport?.response?.data?.errors[0].message) {
          return sentReport;
        }

        return sentReport.data;
      })
      .catch((error) => error);
  }

  async getSharedUser() {
    const sessionToken = sessionStorage.getItem('idftoken-public');

    const token = sessionToken && JSON.parse(sessionToken).access_token;

    return axios.post(
      '/api/auth/token/introspect',
      { token },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export default new PublicReportService();
