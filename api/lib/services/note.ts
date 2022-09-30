import { v4 as uuidv4 } from 'uuid';

import { Note } from '../database';
import { emitAppEvent } from 'lib/middlewares/emitter';
import { getResourceTypeWithId } from 'lib/utils/utils';
import { NoteModel } from 'lib/database/models/note';
import { AuthUser } from 'lib/middlewares/auth';
import { ExpandModel, StaticModel } from 'lib/database/helpers';
import BaseLog from './utils/BaseLog';
import { FeedModel } from 'lib/database/models/feed';
import { SequelizeOpts } from './utils/Base';
import { feedServiceFactory } from './feed';

class NoteService<
  U extends StaticModel<NoteModel> = StaticModel<NoteModel>
> extends BaseLog<NoteModel> {
  constructor(model: U, user: AuthUser) {
    super(model, user);
  }

  async findAllByResourceId(
    resourceKey: 'contact_id' | 'deal_id' | 'organization_id',
    id: string
  ) {
    const notes = await this.model.findAll({
      where: {
        [resourceKey]: id,
      },
    });

    return this.rowsToJSON(notes);
  }

  async getOneById(id: string) {
    return this.model.findByPk(id);
  }

  async addNote(user: AuthUser, data: any) {
    const userId = user.id;
    const {
      note,
      contact_id = null,
      organization_id = null,
      deal_id = null,
    } = data || {};

    const dataObject = {
      description: '',
      note,
      id: uuidv4(),
    };

    const body = {
      tenant_id: user.tenant,
      assigned_user_id: userId,
      modified_user_id: userId,
      created_by: userId,
      contact_id,
      organization_id,
      deal_id,
      ...dataObject,
    };

    await Note.create(body);
    const feed = await this.feedLog.create({
      ...body,
      tenant_id: user.tenant,
      type: 'note',
      summary: 'Note added',
      object_data: dataObject,
    });

    const { type, id } = getResourceTypeWithId({
      organization_id,
      deal_id,
      contact_id,
    });

    await emitAppEvent({
      event: 'NOTE_CREATED',
      resource: type,
      resource_id: id,
      payload: {
        date: feed.created_at,
        feed,
        text: note,
        user,
      },
    });

    return {};
  }

  async updateNote(
    feed: ReturnType<ExpandModel<FeedModel>['toJSON']>,
    noteId: string,
    data: any
  ) {
    const { note } = data || {};

    const dataObject = {
      description: '',
      note,
      id: noteId,
    };

    await Note.update(
      { modified_user_id: this.user.id, note, description: '' },
      { where: { id: noteId, tenant_id: this.user.tenant } }
    );

    await this.feedLog.updateById(feed.id, {
      tenant_id: this.user.tenant,
      updated_by: this.user.id,
      summary: 'Note updated',
      object_data: dataObject,
    });

    const { type, id } = getResourceTypeWithId({
      organization_id: feed.organization_id,
      deal_id: feed.deal_id,
      contact_id: feed.contact_id,
    });

    await emitAppEvent({
      event: 'NOTE_UPDATED',
      resource: type,
      resource_id: id,
      payload: {
        date: feed.updated_at,
        feed,
        previous_text: feed.object_data?.note,
        text: note,
        user: this.user,
      },
    });

    return {};
  }

  async createNoteAndUpdateFeed(
    feed: ReturnType<ExpandModel<FeedModel>['toJSON']>,
    noteId: string = uuidv4(),
    data: any
  ) {
    const {
      description,
      note,
      contact_id = null,
      organization_id = null,
      deal_id = null,
    } = data || {};

    const dataObject = {
      description,
      note,
      id: noteId,
    };

    const body = {
      assigned_user_id: this.user.id,
      modified_user_id: this.user.id,
      created_by: this.user.id,
      contact_id,
      organization_id,
      deal_id,
      updated_by: this.user.id,
      ...dataObject,
    };

    await Note.create(body);

    await this.feedLog.updateById(feed.id, {
      summary: 'Note updated',
      updated_by: this.user.id,
      object_data: dataObject,
    });

    return {};
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
    const notes = await this.findAllByResourceId(resourceKey, id);

    const feedService = feedServiceFactory(this.user);
    const deletedOn = new Date();
    await Promise.all(
      notes.map(async (note) => {
        const feed = await feedService.findByObjectDataId(note.id);
        if (!feed) {
          return;
        }

        // this is just lame..........
        // really hate entire feed implementation
        await this.feedLog.updateById(feed.id, {
          summary: 'Note updated',
          updated_by: this.user.id,
          object_data: {
            description: note.description,
            note: note.note,
            id: note.id,
            deleted_on: deletedOn,
          },
        });
      })
    );

    await this.model.update(
      { deleted: true },
      {
        ...this.getSequelizeOpts(opts),
        where: {
          [resourceKey]: id,
        },
      }
    );
  }
}

export function noteServiceFactory(user: AuthUser) {
  return new NoteService(Note, user);
}
