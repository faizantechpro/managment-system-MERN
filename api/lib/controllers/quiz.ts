import { Router } from 'express';

import asyncHandler from '../utils/async-handler';
import { QuizService } from '../services';
import { permissionsValidator } from 'lib/middlewares/permissions';

const router = Router();
const path = '/quizzes';

router.get(
  path,
  asyncHandler(async (req, res) => {
    const query: any = req.query;

    const quizzes = await QuizService.getQuizzes(query, req.user);

    res.json(quizzes);
  })
);

router.get(
  `${path}/:id`,
  asyncHandler(async (req, res) => {
    const quiz = await QuizService.getQuiz(req.params.id);
    res.json(quiz);
  })
);

router.delete(
  `${path}/:id`,
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const result = await QuizService.deleteQuiz(req.params.id);
    res.json(result);
  })
);

router.put(
  path,
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const result = await QuizService.createUpdateLesson({
      ...req.body,
      tenant_id: req.user.tenant,
    });

    res.json(result);
  })
);

router.put(
  `${path}/:id/pages`,
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const result = await QuizService.createUpdatePages(req.body, req.user);

    res.json(result);
  })
);

export default router;
