import authHeader from './auth-header';
import BaseRequestService from './baseRequest.service';

export default class BulkImportService extends BaseRequestService {
  async bulkImport(formData, type, options = {}) {
    let url = `/api/${type}/import`;
    if (type === 'people') {
      url = `/api/contacts/import`;
    }
    return await this.post(url, formData, {
      headers: authHeader(),
      params: options,
    });
  }
}
