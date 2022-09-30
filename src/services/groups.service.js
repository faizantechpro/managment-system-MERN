import axios from 'axios';

import authHeader from './auth-header';
const API_URL = '/api/groups';

class GroupService {
  async getGroups(queryFilter, { page = 1, limit = 10, order }) {
    const { filter, ...restProps } = queryFilter || {};

    const params = {
      ...restProps,
      ...filter,
      page,
      limit,
      order,
    };

    return axios
      .get(`${API_URL}`, {
        params,
        headers: authHeader(),
      })
      .then((response) => response.data)
      .catch((error) => error);
  }

  async CreateGroup({ name, parent_id }) {
    return await axios
      .post(API_URL, { name, parent_id }, { headers: authHeader() })
      .then((response) => response.data)
      .catch((error) => error);
  }

  async getGroupById(group_id) {
    return await axios
      .get(`${API_URL}/${group_id}`, { headers: authHeader() })
      .then((response) => response.data)
      .catch((error) => error);
  }

  async updateGroup(data) {
    return await axios
      .put(`${API_URL}/${data.id}`, data, { headers: authHeader() })
      .then((response) => response.data)
      .catch((error) => error);
  }

  async deleteGroup(groups) {
    return axios
      .delete(`${API_URL}`, {
        headers: authHeader(),
        params: {
          ids: groups.join(','),
        },
      })
      .then((response) => response.data)
      .catch((error) => error);
  }

  async removeUserFromGroup(data) {
    return axios
      .delete(`${API_URL}/user`, {
        data,
        headers: authHeader(),
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
}

export default new GroupService();
