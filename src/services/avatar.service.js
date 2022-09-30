import axios from 'axios';
import { ttlMemoize } from '../utils/Utils';
import authHeader from './auth-header';

const API_URL = '/api/avatars';

class AvatarService {
  constructor() {
    this.getAvatarMemoized = ttlMemoize(this.getAvatar);
  }

  getAvatar(avatarId, isTenant = false) {
    const params = isTenant ? {} : { headers: authHeader() };

    return axios
      .get(`${API_URL}/${avatarId}`, params)
      .then((response) => response.data)
      .catch((error) => console.log(error));
  }

  /**
   * Avatars are returned with a signed URL so we must memoize with a
   * ttl which is set based on the URL expiration.
   */
  async getAvatarMemo(avatarId, isTenant = false) {
    const result = await this.getAvatarMemoized.memo(avatarId, isTenant);
    if (result) {
      this.getAvatarMemoized.setTTL(result.expiry, avatarId, isTenant);
    }

    return result;
  }
}

export default new AvatarService();
