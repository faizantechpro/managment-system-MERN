import { Comment, User } from 'lib/database';
import {
  CommentModifyAttributes,
  CommentsModel,
} from 'lib/database/models/comments';
import { AuthUser } from 'lib/middlewares/auth';
import { Pagination } from 'lib/types';
import Base, { SequelizeOpts } from '../utils/Base';

class FeedCommentService extends Base<CommentsModel> {
  async getByFeedId(feedId: string, pagination: Pagination) {
    const { count, rows } = await this.model.findAndCountAll({
      ...this.getPaginationQuery(pagination),
      include: [
        {
          as: 'user',
          model: User,
          attributes: ['id', 'avatar', 'first_name', 'last_name'],
        },
      ],
      where: {
        feed_id: feedId,
      },
      order: [['created_at', 'DESC']],
    });

    return this.getPaginatedResponse(rows, count, pagination);
  }

  async getOne(id: string) {
    return this.defaultFindById(id);
  }

  async create(payload: CommentModifyAttributes) {
    return this.defaultCreate({
      ...payload,
      user_id: this.user.id,
      tenant_id: this.user.tenant,
    });
  }

  async updateOne(id: string, payload: CommentModifyAttributes) {
    return this.defaultUpdateById(id, payload);
  }

  async deleteByFeedId(feedId: string, opts: SequelizeOpts = {}) {
    await this.model.update(
      { deleted: true },
      {
        ...this.getSequelizeOpts(opts),
        where: {
          feed_id: feedId,
        },
      }
    );
  }

  async deleteOne(id: string) {
    await this.model.update(
      { deleted: true },
      {
        where: { id },
      }
    );
  }
}

export function feedCommentServiceFactory(user: AuthUser) {
  return new FeedCommentService(Comment, user);
}
