import axios from 'axios';

import authHeader from './auth-header';
import BaseRequestService from './baseRequest.service';

const API_URL = '/api/organizations';
class OrganizationService extends BaseRequestService {
  async getOrganizations(queryFilter, { page = 1, limit = 10 }) {
    const { filter = null, ...restProps } = queryFilter || {};

    const params = {
      ...restProps,
      ...filter,
      page,
      limit,
    };

    return await this.get(
      API_URL,
      {
        params,
        headers: authHeader(),
      },
      { fullResponse: true }
    );
  }

  async getOrganizationById(id) {
    const result = await this.get(`${API_URL}/${id}`, {
      headers: authHeader(),
    });

    return result;
  }

  async updateOrganization(id, data) {
    return await this.put(`${API_URL}/${id}`, data, {
      headers: authHeader(),
    });
  }

  async del(id) {
    return await this.delete(`${API_URL}/${id}`, {
      headers: authHeader(),
    });
  }

  async deleteOrganizations(organizationIds) {
    return await this.delete(`${API_URL}`, {
      headers: authHeader(),
      params: {
        ids: organizationIds.join(','),
      },
    });
  }

  async createOrganization(data) {
    return await this.post(
      API_URL,
      data,
      {
        headers: authHeader(),
      },
      { fullResponse: true }
    );
  }

  async getFollowers(organization_id, { page = 1, limit = 5 }) {
    return await this.get(`${API_URL}/${organization_id}/followers`, {
      headers: authHeader(),
      params: {
        page,
        limit,
      },
    });
  }

  async checkFollowing(organization_id, user_id) {
    const result = await this.get(
      `${API_URL}/${organization_id}/followers/${user_id}`,
      {
        headers: authHeader(),
      }
    );
    return result.isFollower;
  }

  async stopFollowing(organization_id, user_id) {
    return await this.delete(
      `${API_URL}/${organization_id}/followers/${user_id}`,
      {
        headers: authHeader(),
      }
    );
  }

  async startFollowing(organization_id, user_id) {
    return await this.post(
      `${API_URL}/${organization_id}/followers/${user_id}`,
      {},
      {
        headers: authHeader(),
      }
    );
  }

  async getOwners(organization_id, { page = 1, limit = 5 }) {
    return await this.get(`${API_URL}/${organization_id}/owners`, {
      headers: authHeader(),
      params: {
        page,
        limit,
      },
    });
  }

  async addOwner(organization_id, user_id) {
    return await this.post(
      `${API_URL}/${organization_id}/owners/${user_id}`,
      {},
      {
        headers: authHeader(),
      }
    );
  }

  async removeOwner(organizationId, userId) {
    const response = await this.delete(
      `${API_URL}/${organizationId}/owners/${userId}`,
      {
        headers: authHeader(),
      },
      {
        fullResponse: true,
        errorsRedirect: false,
      }
    );

    if (response.status === 200) {
      const { data } = response;

      return data;
    }

    return response;
  }

  getFieldByOrganization(organization_id, { page = 1, limit = 10 }) {
    return axios
      .get(`${API_URL}/${organization_id}/fields`, {
        headers: authHeader(),
        params: {
          page,
          limit,
        },
      })
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
  }

  async upsertCustomFieldOrganization(organization_id, data) {
    return await this.put(`${API_URL}/${organization_id}/fields`, data, {
      headers: authHeader(),
    });
  }

  checkRelations(ids) {
    return axios
      .get(`${API_URL}/check-relations`, {
        headers: authHeader(),
        params: {
          ids: ids.join(','),
        },
      })
      .then((response) => response.data);
  }

  getRelations(id) {
    return axios
      .get(`${API_URL}/${id}/related`, {
        headers: authHeader(),
      })
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
  }

  async addRelation(organization_id, related_id, type) {
    return await axios.post(
      `${API_URL}/related`,
      { organization_id, related_id, type },
      {
        headers: authHeader(),
      }
    );
  }

  async deleteRelation(organizationId) {
    const response = await this.delete(
      `${API_URL}/related/${organizationId}`,
      {
        headers: authHeader(),
      },
      {
        fullResponse: true,
        errorsRedirect: false,
      }
    );

    if (response.status === 200) {
      const { data } = response;

      return data;
    }

    return response;
  }

  async getContactsByOrganizationId(id) {
    return await this.get(
      `/api/organizations/${id}/contacts`,
      {
        params: {
          page: 1,
          limit: 10,
        },
        headers: authHeader(),
      },
      { fullResponse: true }
    );
  }
}

export default new OrganizationService();
