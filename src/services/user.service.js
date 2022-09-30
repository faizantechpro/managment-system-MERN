import axios from 'axios';
import { ttlMemoize } from '../utils/Utils';
import authHeader from './auth-header';

const API_USERS_URL = '/api/users';

class UserService {
  constructor() {
    this.getUserAvatarMemoized = ttlMemoize(this.getUserAvatar);
  }

  getUserInfo() {
    return axios
      .get(`${API_USERS_URL}/me`, { headers: authHeader() })
      .then((response) => {
        return response.data;
      });
  }

  invite(invitationInfo) {
    return axios
      .post(`${API_USERS_URL}/invite`, invitationInfo, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data;
      });
  }

  acceptInvite(token, data) {
    return axios
      .post(`/api/auth/invite/accept`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return response.data;
      });
  }

  sendMessage(data) {
    return axios
      .post(`${API_USERS_URL}/message`, data, {
        headers: authHeader(),
      })
      .then((response) => response);
  }

  updateUserInfo(data) {
    return axios
      .put(`${API_USERS_URL}/me`, data, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data;
      });
  }

  uploadAvatar(body) {
    return axios.post('/api/files', body, {
      headers: {
        ...authHeader(),
      },
    });
  }

  getFile(id) {
    return axios
      .get(`/api/files/${id}`, { headers: authHeader() })
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }

  getAvatar(avatarId) {
    return axios
      .get(`/api/assets/${avatarId}`, {
        headers: authHeader(),
        responseType: 'blob',
      })
      .then((response) => response.data)
      .catch((error) => console.log(error));
  }

  updatePassword(data) {
    return axios.put(`${API_USERS_URL}/change_password`, data, {
      headers: authHeader(),
    });
  }

  removeUsers(data) {
    return axios
      .delete(API_USERS_URL, {
        headers: authHeader(),
        params: {
          ids: data.join(','),
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err));
  }

  getUserById(id) {
    return axios
      .get(`${API_USERS_URL}/${id}`, {
        headers: authHeader(),
      })
      .then((response) => response.data)
      .catch((error) => console.log(error));
  }

  getUserAvatar(userId) {
    return axios
      .get(`${API_USERS_URL}/${userId}/avatar`, {
        headers: authHeader(),
      })
      .then((response) => response.data)
      .catch((error) => console.log(error));
  }

  /**
   * Avatars are returned with a signed URL so we must memoize with a
   * ttl which is set based on the URL expiration.
   */
  async getUserAvatarMemo(userId) {
    const result = await this.getUserAvatarMemoized.memo(userId);
    if (result) {
      this.getUserAvatarMemoized.setTTL(result.expiry, userId);
    }

    return result;
  }

  updateUserInfoById(id, data) {
    return axios
      .put(`${API_USERS_URL}/${id}`, data, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data;
      });
  }

  resentInvite(data) {
    return axios
      .post(`${API_USERS_URL}/resent-invite`, data, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data;
      });
  }

  changeStatus(id, status) {
    return axios
      .patch(
        `${API_USERS_URL}/${id}/status`,
        { status },
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        return response.data;
      });
  }

  getUsers(queryFilter = {}, { page = 1, extraData }) {
    if (queryFilter.role) {
      queryFilter.roleId = queryFilter.role;
      delete queryFilter.role;
    }

    const { filter, ...restProps } = queryFilter;

    const params = {
      ...restProps,
      ...filter,
      page,
      limit: 10,
      extraData,
    };

    return axios
      .get(API_USERS_URL, {
        params,
        headers: authHeader(),
      })
      .then((response) => response);
  }

  getOrganizationsOwners(params) {
    return axios
      .get(`api/organizations/owners`, { params, headers: authHeader() })
      .then((response) => response);
  }

  getContactOwners(params) {
    return axios
      .get(`api/contacts/owners`, { params, headers: authHeader() })
      .then((response) => response);
  }

  getDealsOwners(params) {
    return axios
      .get(`api/deals/owners`, { params, headers: authHeader() })
      .then((response) => response);
  }

  getMatchingGuests(search) {
    return axios
      .get(`${API_USERS_URL}/guests`, {
        params: { search },
        headers: authHeader(),
      })
      .then((response) => response);
  }

  getGuestsByIds(ids) {
    return axios
      .get(`${API_USERS_URL}/guests/ids`, {
        params: { ids },
        headers: authHeader(),
      })
      .then((response) => response);
  }

  async updatePasswordByUserId(user_id, data) {
    const response = await axios.put(
      `${API_USERS_URL}/${user_id}/password`,
      data,
      {
        headers: authHeader(),
      }
    );
    return response;
  }
}

export default new UserService();
