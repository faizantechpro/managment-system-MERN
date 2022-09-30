import { Router } from 'express';
import Joi from 'joi';

import asyncHandler from '../utils/async-handler';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { InvalidPayload } from 'lib/middlewares/exception';
import { LessonServiceFactory } from 'lib/services';

const router = Router();

router.put(
  '/lessons',
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const lessonService = LessonServiceFactory(req.user);

    const lesson = await lessonService.createUpdateLesson(req.body);

    res.json(lesson);
  })
);

router.get(
  '/lessons/overview',
  asyncHandler(async (req, res) => {
    const userId = req?.query?.userId || req.user.id;
    const lessonService = LessonServiceFactory(req.user);
    const progress = await lessonService.getOverallProgress(
      req.query,
      userId as string
    );

    res.json(progress);
  })
);

router.get(
  '/lessons/related',
  asyncHandler(async (req, res) => {
    const lessonService = LessonServiceFactory(req.user);
    const lessons = await lessonService.getRelatedLessons();

    res.json(lessons);
  })
);

router.get(
  '/lessons/:pk',
  asyncHandler(async (req, res) => {
    const lessonService = LessonServiceFactory(req.user);
    const lesson = await lessonService.getLessonById(req.params.pk);

    if (!lesson) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(lesson);
  })
);

router.post(
  '/lessons/:pk/track',
  asyncHandler(async (req, res) => {
    const page = {
      id: req.body.page_id,
      isFirst: req.body.is_first,
      isLast: req.body.is_last,
      progress: req.body.progress || 0,
      points: req.body.points || null,
    };
    const lessonService = LessonServiceFactory(req.user);
    const lesson = await lessonService.trackLesson(req.params.pk, page);

    if (!lesson) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(lesson);
  })
);

router.get(
  '/lessons/:pk/track',
  asyncHandler(async (req, res) => {
    const lessonId = req.params.pk;

    const lessonService = LessonServiceFactory(req.user);

    const resp = await lessonService.track(lessonId);

    res.json(resp);
  })
);

router.put(
  '/lessons/:id/favorite',
  asyncHandler(async (req, res) => {
    const { lessonId } = req.body;

    const lessonService = LessonServiceFactory(req.user);
    const lessonTracking = await lessonService.trackFavorite(lessonId);

    res.json(lessonTracking);
  })
);

const checkPathSchema = Joi.object({
  id: Joi.number().required(),
  page_id: Joi.number().required(),
});

router.post(
  '/lessons/:id/pages/:page_id/check',
  asyncHandler(async (req, res) => {
    const lessonId = req.params.id;
    const pageId = req.params.page_id;

    const { error } = checkPathSchema.validate(req.params);
    if (error) throw new InvalidPayload(error.message);

    const userId = req.user.id;

    const lessonService = LessonServiceFactory(req.user);
    const checkAnswer = await lessonService.submitAnswer(
      userId,
      lessonId,
      pageId,
      req.body.answer
    );
    res.json({ success: checkAnswer });
  })
);

router.put(
  '/lessons/:id/pages',
  asyncHandler(async (req, res) => {
    const lessonService = LessonServiceFactory(req.user);

    const lessonPages = await lessonService.createUpdatePages(req.body);

    res.json(lessonPages);
  })
);

router.get(
  '/lessons/:id/tracked',
  asyncHandler(async (req, res) => {
    const lessonId = req.params.id;

    const lessonService = LessonServiceFactory(req.user);

    const resp = await lessonService.tracked(lessonId);

    res.json(resp);
  })
);

router.put(
  '/lessons/:id',
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const {
      params: { id },
    } = req;

    const { error } = Joi.string().not('').required().validate(id);

    if (error) throw new InvalidPayload(error.message);

    const lessonService = LessonServiceFactory(req.user);

    const lesson = await lessonService.deleteLesson(req.params.id);

    res.json(lesson);
  })
);

export default router;
