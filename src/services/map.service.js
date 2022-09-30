import axios from 'axios';

import authHeader from './auth-header';

const API_URL = '/api/maps/geocode';

class MapService {
  getGoogleAddress(address) {
    return axios
      .get(API_URL, {
        params: {
          address,
        },
        headers: authHeader(),
      })
      .then((response) => response);
  }
}

export default new MapService();
