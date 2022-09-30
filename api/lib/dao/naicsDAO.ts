import { Pagination } from './utils';
import DAO from './utils/DAO';

export class NaicsDAO extends DAO<'NaicsDB'> {
  async find(pagination: Pagination, query: { search?: string }) {
    const builder = this.where();

    if (query.search) {
      builder.iLike(query.search, 'title', 'code');
    }

    const { count, rows } = await this.repo.findAndCountAll({
      where: builder.build(),
      order: [['title', 'ASC']],
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(this.rowsToJSON(rows), count, pagination);
  }

  async findOneByCode(code: string) {
    const naics = await this.repo.findByPk(code);

    return this.toJSON(naics);
  }
}
