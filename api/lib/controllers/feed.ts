import { Router } from 'express';
import Joi from 'joi';

import asyncHandler from '../utils/async-handler';
import { feedValidator } from '../middlewares/ownerValidator';
import { FEEDTABS } from 'lib/utils/constants';
import {
  activityServiceFactory,
  feedFileServiceFactory,
  feedServiceFactory,
} from 'lib/services';
import { noteServiceFactory } from 'lib/services/note';
import { InvalidPayload, ResourceNotFound } from 'lib/middlewares/exception';
import { getResourceTypeWithId } from 'lib/utils/utils';
import { emitAppEvent } from 'lib/middlewares/emitter';
import { feedCommentServiceFactory } from 'lib/services/feed/feedComment';

const router = Router();
const path = '/feed';

router.get(
  path,
  asyncHandler(async (req, res) => {
    const service = feedServiceFactory(req.user);
    const feed = await service.getActivityFeed(req.query);

    res.json(feed);
  })
);

router.get(
  `${path}/activities/:activityId/feed`,
  asyncHandler(async (req, res) => {
    const { activityId } = req.params;
    const feedService = feedServiceFactory(req.user);
    const feed = await feedService.getSingleActivityFeed(activityId);

    res.json(feed);
  })
);

router.post(
  `${path}/file`,
  asyncHandler(async (req, res) => {
    const feedFileService = feedFileServiceFactory(req.user);
    const file = await feedFileService.addFile(req.body, req.user);

    res.json(file);
  })
);

router.post(
  `${path}/note`,
  asyncHandler(async (req, res) => {
    const service = noteServiceFactory(req.user);
    await service.addNote(req.user, req.body);

    res.json({});
  })
);

router.put(
  `${path}/:feedId/note/:noteId`,
  asyncHandler(async (req, res) => {
    const { feedId, noteId } = req.params;
    const feedService = feedServiceFactory(req.user);
    const noteService = noteServiceFactory(req.user);

    const feed = await feedService.getOne(feedId);

    if (!feed) {
      throw new ResourceNotFound('Feed');
    }

    if (!req.user.admin) {
      await feedValidator({ user: req.user, id: feedId });
    }

    const data = feed?.object_data;

    if (data.id === noteId) {
      const note = await noteService.getOneById(noteId);
      if (!note) {
        throw new ResourceNotFound('Note');
      }

      await noteService.updateNote(feed, noteId, req.body);
    } else {
      const { id: userId } = req.user;

      const dataObject = {
        assigned_user_id: userId,
        modified_user_id: userId,
        created_by: userId,
        contact_id: feed.contact_id,
        organization_id: feed.organization_id,
        deal_id: feed.deal_id,
        description: '',
        note: req.body.note,
        tenant_id: req.user.tenant,
      };

      await noteService.createNoteAndUpdateFeed(feed, noteId, dataObject);
    }

    res.json({});
  })
);

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});
router.get(
  `${path}/:feed_id/comments`,
  asyncHandler(async (req, res) => {
    const { feed_id } = req.params;
    const { value } = paginationSchema.validate(req.query);

    const service = feedCommentServiceFactory(req.user);
    const comments = await service.getByFeedId(feed_id, value);

    return res.json(comments);
  })
);

const commentSchema = Joi.object({
  feed_id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  contact_id: Joi.string().uuid({ version: 'uuidv4' }).optional(),
  organization_id: Joi.string().uuid({ version: 'uuidv4' }).optional(),
  deal_id: Joi.string().uuid({ version: 'uuidv4' }).optional(),
  message: Joi.string().optional().default(''),
  comment: Joi.object().required(),
});
router.post(
  `${path}/comments`,
  asyncHandler(async (req, res) => {
    const { error, value } = commentSchema.validate(req.body);
    if (error) throw new InvalidPayload(error.message);

    const feedService = feedServiceFactory(req.user);
    const commentService = feedCommentServiceFactory(req.user);

    const comment = await commentService.create({ ...value });

    const foundFeed = await feedService.getOne(value.feed_id); // TODO: check if feed exists
    if (!foundFeed) {
      throw new ResourceNotFound('Feed');
    }

    const { organization_id, deal_id, contact_id } = foundFeed;
    const { type, id } = getResourceTypeWithId({
      organization_id,
      deal_id,
      contact_id,
    });

    await emitAppEvent({
      event: 'COMMENT_CREATED',
      resource: type,
      resource_id: id,
      payload: {
        date: comment.updated_at,
        feed: foundFeed,
        text: comment.comment,
        user: req.user,
      },
    });

    return res.json({});
  })
);

const updateCommentSchema = Joi.object({
  message: Joi.string().optional().default(''),
  comment: Joi.object().required(),
});
router.put(
  `${path}/comments/:commentId`,
  asyncHandler(async (req, res) => {
    const { error, value } = updateCommentSchema.validate(req.body);
    if (error) throw new InvalidPayload(error.message);

    const { commentId } = req.params;

    const feedService = feedServiceFactory(req.user);
    const commentService = feedCommentServiceFactory(req.user);

    const previousComment = await commentService.getOne(commentId);
    if (!previousComment) {
      throw new ResourceNotFound('Comment');
    }
    const comment = await commentService.updateOne(commentId, value);
    if (!comment) {
      throw new ResourceNotFound('Comment');
    }

    const feed = await feedService.getOne(comment.feed_id);
    if (!feed) {
      throw new ResourceNotFound('feed');
    }

    const { type, id } = getResourceTypeWithId({
      organization_id: feed.organization_id,
      deal_id: feed.deal_id,
      contact_id: feed.contact_id,
    });
    await emitAppEvent({
      event: 'COMMENT_UPDATED',
      resource: type,
      resource_id: id,
      payload: {
        date: feed.updated_at,
        feed,
        previous_text: previousComment.comment,
        text: value.comment,
        user: req.user,
      },
    });

    return res.json(comment);
  })
);

router.delete(
  `${path}/comments/:commentId`,
  asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const service = feedCommentServiceFactory(req.user);
    await service.deleteOne(commentId);

    return res.json({});
  })
);

const activitySchema = Joi.object({
  contacts: Joi.array().optional(),
  organization_id: Joi.string()
    .uuid({ version: 'uuidv4' })
    .allow(null)
    .optional(),
  deal_id: Joi.string().uuid({ version: 'uuidv4' }).allow(null).optional(),
  name: Joi.string().required(),
  type: Joi.string().required(),
  start_date: Joi.date().required(),
  guests: Joi.string().allow('').optional(),
  location: Joi.string().allow('').optional(),
  conference_link: Joi.string().allow('').optional(),
  description: Joi.string().allow('').optional(),
  free_busy: Joi.string().optional(),
  notes: Joi.string().allow('').optional(),
  owner: Joi.string().required(),
  lead: Joi.string().allow('').optional(),
  done: Joi.boolean().optional(),
  contact_info: Joi.object().allow(null).optional(),
  rich_note: Joi.object().optional().allow(null),
});

router.put(
  `${path}/:feedId/activity/:activityId`,
  asyncHandler(async (req, res) => {
    const { error } = activitySchema.validate(req.body);

    if (error) throw new InvalidPayload(error.message);

    const { feedId, activityId } = req.params;

    if (!req.user.admin) {
      await feedValidator({ user: req.user, id: feedId });
    }

    const feedService = feedServiceFactory(req.user);
    const activityService = activityServiceFactory(req.user);

    const feed = await feedService.getOne(feedId);
    if (!feed) {
      throw new ResourceNotFound('Feed');
    }

    const result = await activityService.updateActivityFeed(
      feed,
      activityId,
      req.body
    );

    return res.json(result);
  })
);

router.get(
  `${path}/activity`,
  asyncHandler(async (req, res) => {
    const activityService = activityServiceFactory(req.user);
    const activities = await activityService.getActivities(req.query);

    res.json(activities);
  })
);

router.get(
  `${path}/activities/:activityId`,
  asyncHandler(async (req, res) => {
    const { activityId } = req.params;

    const activityService = activityServiceFactory(req.user);
    const activities = await activityService.getOne(activityId);

    res.json(activities);
  })
);

const updateActivitySchema = Joi.object({
  feedId: Joi.string().uuid({ version: 'uuidv4' }).optional(),
  contact_id: Joi.string().uuid({ version: 'uuidv4' }).optional(),
  organization_id: Joi.string().uuid({ version: 'uuidv4' }).optional(),
  deal_id: Joi.string().uuid({ version: 'uuidv4' }).optional(),
  name: Joi.string().optional(),
  type: Joi.string().optional(),
  start_date: Joi.date().optional(),
  guests: Joi.string().optional(),
  location: Joi.string().allow('').optional(),
  conference_link: Joi.string().allow('').optional(),
  description: Joi.string().allow('').optional(),
  free_busy: Joi.string().optional(),
  notes: Joi.string().allow('').optional(),
  owner: Joi.string().optional(),
  lead: Joi.string().allow('').optional(),
  done: Joi.boolean().optional(),
});

router.put(
  `${path}/activity`,
  asyncHandler(async (req, res) => {
    const { error } = updateActivitySchema.validate(req.body);
    if (error) throw new InvalidPayload(error.message);

    const activityService = activityServiceFactory(req.user);
    const respUpdate = await activityService.updateActivity(req.body);

    return res.json(respUpdate);
  })
);

router.get(
  `${path}/taps-types`,
  asyncHandler(async (req, res) => {
    const { query } = req;

    const service = feedServiceFactory(req.user);
    const data = await service.getNumberTypes({ ...query }, FEEDTABS);

    res.json(data);
  })
);

export default router;
