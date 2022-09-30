import axios from 'axios';
import authHeader from './auth-header';
import { PROSPECTS_FILTER_STORAGE_KEY } from '../utils/Utils';

const API_URL = '/api/auth/';
const STORAGE_KEY = 'idftoken';

class AuthService {
  login(email, password, code = null) {
    return axios
      .post(API_URL + 'login', {
        email,
        password,
        mode: 'json',
        otp: code || undefined,
      })
      .then((response) => {
        if (response?.response?.status === 401) throw response;

        if (
          response.data.access_token &&
          response.data.access_token !== 'otp_enabled'
        ) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  impersonate(id) {
    return axios
      .post(
        `/api/users/${id}/impersonate`,
        { id },
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        if (
          response.data.access_token &&
          response.data.access_token !== 'otp_enabled'
        ) {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem('user_permissions');
          localStorage.removeItem(PROSPECTS_FILTER_STORAGE_KEY);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROSPECTS_FILTER_STORAGE_KEY);
    localStorage.removeItem('user_permissions');
  }

  requestPassword(email) {
    return axios
      .post(API_URL + 'password/request', {
        email,
        mode: 'json',
      })
      .then((response) => {
        return response.data.message;
      });
  }

  resetPassword(password, token) {
    return axios
      .post(
        API_URL + 'password/reset',
        {
          password,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        return response.data;
      });
  }

  twoFactorAuthentication(code) {
    return axios.post(API_URL + '2fa', { code }).then((response) => {
      return response.data;
    });
  }

  getCurrentUser() {
    const token = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const now = new Date().getTime();

    if (token && token.expires - now > 0) {
      return token;
    }

    // token expired remove it from localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROSPECTS_FILTER_STORAGE_KEY);
    return false;
  }

  guestToken(email) {
    return axios
      .post(`/api/auth/guest/token`, {
        grant_type: 'guest_generate',
        email: {
          to: email,
          subject: '',
          message: '',
        },
        redirect_url: `${window.location.origin}/public/organizations/profile`,
      })
      .then((response) => response);
  }
}

export default new AuthService();
