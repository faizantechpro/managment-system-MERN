import axios from 'axios';

import authHeader from './auth-header';
import BaseRequestService from './baseRequest.service';

const API_URL = '/api/contacts';
class ContactService extends BaseRequestService {
  async getContactById(id) {
    return await this.get(`${API_URL}/${id}`, {
      headers: authHeader(),
    });
  }

  async updateContact(id, data) {
    return await this.put(`${API_URL}/${id}`, data, {
      headers: authHeader(),
    });
  }

  async linkOrganization(contact_id, organization_id) {
    return await this.put(
      `${API_URL}/${contact_id}/organization/${organization_id}/link`,
      {},
      {
        headers: authHeader(),
      }
    );
  }

  async unlinkOrganization(contact_id, organization_id) {
    return await this.put(
      `${API_URL}/${contact_id}/organization/${organization_id}/unlink`,
      {},
      {
        headers: authHeader(),
      }
    );
  }

  async getContactsByorganizationId(queryFilter, { page = 1, limit = 5 }) {
    const { filter, organizationId, ...restProps } = queryFilter || {};

    const params = {
      ...restProps,
      ...filter,
      page,
      limit,
    };

    return await this.get(`/api/organizations/${organizationId}/contacts`, {
      headers: authHeader(),
      params,
    });
  }

  removeOrganization(contactId) {
    return axios.put(
      `${API_URL}/${contactId}`,
      { organization_id: null },
      { headers: authHeader() }
    );
  }

  async getContact(queryFilter, { page = 1, limit = 10 }) {
    const { filter, ...restProps } = queryFilter || {};

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

  async createContact(data) {
    return await this.post(
      API_URL,
      data,
      {
        headers: authHeader(),
      },
      { fullResponse: true, errorsRedirect: true }
    );
  }

  async deleteContact(id) {
    return await this.delete(`${API_URL}/${id}`, { headers: authHeader() });
  }

  async deleteContacts(contactsIds) {
    return await this.delete(`${API_URL}`, {
      headers: authHeader(),
      params: {
        ids: contactsIds.join(','),
      },
    });
  }

  async getFollowers(contact_id, { page = 1, limit = 5 }) {
    return await this.get(`${API_URL}/${contact_id}/followers`, {
      headers: authHeader(),
      params: {
        page,
        limit,
      },
    });
  }

  async checkFollowing(contact_id, user_id) {
    const result = await this.get(
      `${API_URL}/${contact_id}/followers/${user_id}`,
      {
        headers: authHeader(),
      }
    );
    return result.isFollower;
  }

  async stopFollowing(contact_id, user_id) {
    return await this.delete(`${API_URL}/${contact_id}/followers/${user_id}`, {
      headers: authHeader(),
    });
  }

  async startFollowing(contact_id, user_id) {
    return await this.post(
      `${API_URL}/${contact_id}/followers/${user_id}`,
      {},
      {
        headers: authHeader(),
      }
    );
  }

  async getOwners(contact_id, { page = 1, limit = 5 }) {
    return await this.get(`${API_URL}/${contact_id}/owners`, {
      headers: authHeader(),
      params: {
        page,
        limit,
      },
    });
  }

  async addOwner(contact_id, user_id) {
    return await this.post(
      `${API_URL}/${contact_id}/owners/${user_id}`,
      {},
      {
        headers: authHeader(),
      }
    );
  }

  removeOwner(contact_id, user_id) {
    return axios.delete(`${API_URL}/${contact_id}/owners/${user_id}`, {
      headers: authHeader(),
    });
  }

  getFieldByContact(contact_id, { page = 1, limit = 10 }) {
    return axios
      .get(`${API_URL}/${contact_id}/fields`, {
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

  async upsertCustomField(contact_id, data) {
    return await this.put(`${API_URL}/${contact_id}/fields`, data, {
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
}

export default new ContactService();
