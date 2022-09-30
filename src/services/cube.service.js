import cubejs from '@cubejs-client/core';
import axios from 'axios';
import authHeader from './auth-header';
import BaseRequestService from './baseRequest.service';

class CubeService extends BaseRequestService {
  constructor() {
    super();
    this.initCube();
  }

  initCube() {
    this.cube = cubejs(
      () => {
        const creds = JSON.parse(localStorage.getItem('idftoken'));
        return `Bearer ${creds.access_token}`;
      },
      {
        apiUrl: `${window.location.origin}/api/analytics/v1`,
        method: 'POST',
      }
    );
  }

  getCube() {
    this.initCube();
    return this.cube;
  }

  getAnalytics({ isPublic }) {
    return axios
      .get('/api/analytics', {
        params: { isPublic },
        headers: authHeader(),
      })
      .then((response) => response.data);
  }
}

export const cubeService = new CubeService();
