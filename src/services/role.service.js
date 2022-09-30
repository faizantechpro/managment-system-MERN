import authHeader from './auth-header';
import BaseRequestService from './baseRequest.service';

const API_URL = '/api/roles';
const url = API_URL;
class RoleService extends BaseRequestService {
  async GetRoles(query = {}) {
    const { page = 1, limit = 10, order } = query;

    return await this.get(url, {
      params: { order, page, limit },
      headers: authHeader(),
    });
  }

  async CreateRole(data) {
    return await this.post(API_URL, data, { headers: authHeader() });
  }

  async getRoleById(roleId) {
    return await this.get(`${API_URL}/${roleId}`, { headers: authHeader() });
  }

  async updateRole(roleData) {
    return await this.put(`${API_URL}/${roleData.id}`, roleData, {
      headers: authHeader(),
    });
  }

  async deleteRole(roleId) {
    return await this.delete(`${API_URL}/${roleId}`, {
      headers: authHeader(),
    });
  }

  async updateRoleUser(roleUserData) {
    return await this.put(
      `${API_URL}/user/${roleUserData.userId}`,
      roleUserData,
      {
        headers: authHeader(),
      }
    );
  }

  async getPermissionsByRole(roleId) {
    return await this.get(`${API_URL}/permissions/${roleId}`, {
      headers: authHeader(),
    });
  }

  async savePermissions(permissionsData) {
    return await this.post(`${API_URL}/permissions/`, permissionsData, {
      headers: authHeader(),
    });
  }

  async updatePermissions(roleId, permissionsData) {
    return await this.put(
      `${API_URL}/${roleId}/permissions/`,
      {
        permissions: permissionsData,
      },
      {
        headers: authHeader(),
      }
    );
  }
}

export default new RoleService();
