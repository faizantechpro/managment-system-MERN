import { v4 as uuidv4 } from 'uuid';
import { WhereOptions } from 'sequelize';

import { ActivityFile } from '../../database';
import { AuthUser } from 'lib/middlewares/auth';
import { ActivityFileModel } from 'lib/database/models/activityFile';
import { SequelizeOpts } from '../utils/Base';
import BaseLog from '../utils/BaseLog';
import { feedServiceFactory } from './feed';

class FeedFileService extends BaseLog<ActivityFileModel> {
  async findAllByResourceId(
    resourceKey: 'contact_id' | 'deal_id' | 'organization_id',
    id: string
  ) {
    const feedFiles = await this.model.findAll({
      where: {
        [resourceKey]: id,
      },
    });

    return this.rowsToJSON(feedFiles);
  }

  async addFile(data: any, user?: any) {
    const userId = user ? user.id : null; // TODO refactor this

    const body = {
      id: uuidv4(),
      contact_id: data.contact_id || null,
      organization_id: data.organization_id || null,
      file_id: data.file_id,
      deal_id: data.deal_id,
      tenant_id: data.tenant_id || user.tenant || null,
      // TODO refactor this class to Admin/User/Guest classes
      assigned_user_id: userId || data.assigned_user_id,
      created_by: userId || data.created_by,
    };

    return await this.model.create(body);
  }

  async getFiles(query: any) {
    const { contact_id, organization_id, dealId, page, limit } = query || {};
    const where: WhereOptions = {};

    if (contact_id) {
      where['contact_id'] = contact_id;
    }

    if (organization_id) {
      where['organization_id'] = organization_id;
    }

    if (dealId) {
      where['deal_id'] = dealId;
    }

    const result = await ActivityFile.findAndCountAll({
      include: ['file'],
      where,
      limit,
      offset: limit * (page - 1),
      order: [['updated_at', 'DESC']],
    });

    const dataCount = result.count;

    return {
      files: result.rows,
      pagination: {
        limit: Number(limit),
        page: Number(page),
        totalPages: Math.ceil(dataCount / limit),
        count: dataCount,
      },
    };
  }

  async deleteActivityFile(id: any) {
    const query = {
      where: { file_id: id },
    };

    const record = await ActivityFile.findOne(query);

    await ActivityFile.destroy(query);

    return record;
  }

  async getActivityFilesByFileId(id: string) {
    const result = await ActivityFile.findOne({
      include: ['file'],
      where: { file_id: id },
      order: [['updated_at', 'DESC']],
    });

    return result;
  }

  async deleteByContactId(contactId: string, opts: SequelizeOpts = {}) {
    return this.deleteByResourceId('contact_id', contactId, opts);
  }
  async deleteByDealId(dealId: string, opts: SequelizeOpts = {}) {
    return this.deleteByResourceId('deal_id', dealId, opts);
  }
  async deleteByOrganizationId(
    organizationId: string,
    opts: SequelizeOpts = {}
  ) {
    return this.deleteByResourceId('organization_id', organizationId, opts);
  }
  async deleteByResourceId(
    resourceKey: 'contact_id' | 'deal_id' | 'organization_id',
    id: string,
    opts: SequelizeOpts = {}
  ) {
    const feedFiles = await this.findAllByResourceId(resourceKey, id);

    const feedService = feedServiceFactory(this.user);
    const deletedOn = new Date();

    await Promise.all(
      feedFiles.map(async (feedFile) => {
        const feed = await feedService.findByObjectDataId(feedFile.file_id);
        if (!feed) {
          return;
        }

        // this is just lame..........
        // really hate entire feed implementation
        await this.feedLog.updateById(feed.id, {
          summary: 'File upload deleted',
          updated_by: this.user.id,
          object_data: {
            id: feedFile.id,
            deleted_on: deletedOn,
          },
        });
      })
    );

    await this.model.destroy({
      ...this.getSequelizeOpts(opts),
      where: {
        [resourceKey]: id,
      },
    });
  }
}

export function feedFileServiceFactory(user: AuthUser) {
  return new FeedFileService(ActivityFile, user);
}
