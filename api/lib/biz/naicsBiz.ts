import { Pagination } from 'lib/dao';
import { Biz } from './utils';

export class NaicsBiz extends Biz {
  async get(pagination: Pagination, query: { search?: string }) {
    return this.services.dao.naics.find(pagination, query);
  }

  async getByCode(code: string) {
    const naics = await this.services.dao.naics.findOneByCode(code);

    if (!naics) {
      throw new this.exception.ResourceNotFound('naics');
    }

    return naics;
  }
}
