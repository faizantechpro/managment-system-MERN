import { Router } from 'express';
import Joi from 'joi';

import asyncHandler from '../utils/async-handler';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { permissions } from 'lib/utils/permissions';
import { InvalidPayload } from 'lib/middlewares/exception';
import { CourseServiceFactory } from 'lib/services';

const route = Router();
const path = '/courses';

const deleteSchema = Joi.object({
  coursesId: Joi.array().required(),
});

route.delete(
  path,
  permissionsValidator(permissions.courses.delete),
  asyncHandler(async (req, res) => {
    const { error } = deleteSchema.validate(req.body);

    if (error) throw new InvalidPayload(error.message);

    const { coursesId } = req.body;
    const service = CourseServiceFactory(req.user);
    await service.removeCourses(coursesId);

    return res.json({});
  })
);

route.patch(
  `${path}/:id`,
  permissionsValidator(permissions.courses.edit),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const service = CourseServiceFactory(req.user);
    const result = await service.updateCourse(id, req.body);

    return res.json(result);
  })
);

const courseSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  is_learning_path: Joi.boolean().required(),
  category_id: Joi.number().allow('', null),
  status: Joi.string().allow(null, '').default('Published'),
  quiz_id: Joi.string().uuid(),
  badge_id: Joi.string().uuid(),
  lessons: Joi.array(),
});

route.post(
  path,
  permissionsValidator(permissions.courses.create),
  asyncHandler(async (req, res) => {
    const { error } = courseSchema.validate(req.body);

    if (error) throw new InvalidPayload(error.message);
    const service = CourseServiceFactory(req.user);
    const course = await service.createCourseWithLessons({
      ...req.body,
      tenant_id: req.user.tenant,
    });

    res.json(course);
  })
);

route.get(
  `${path}/:id/lessons`,
  // permissionsValidator(permissions.courses.view), TODO: Create permissions of courses
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { error } = Joi.string().uuid().validate(id);

    if (error) throw new InvalidPayload(error.message);
    const service = CourseServiceFactory(req.user);
    const courseLesson = await service.getCourseLessonById(id);

    res.send(courseLesson);
  })
);

const courseUpdateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  is_learning_path: Joi.boolean().required(),
  category_id: Joi.number().allow('', null),
  quiz_id: Joi.string().uuid().optional(),
  badge_id: Joi.string().uuid().optional(),
  lessons: Joi.array().min(2).required(),
  removedLessons: Joi.array().min(0).allow(null),
  status: Joi.string().allow(null).optional(),
});

route.put(
  `${path}/:id/lessons`,
  permissionsValidator(permissions.courses.edit),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { error } = courseUpdateSchema.validate(req.body);

    if (error) throw new InvalidPayload(error.message);
    const service = CourseServiceFactory(req.user);
    const courseLesson = await service.updateCourseWithLessons({
      ...req.body,
      id,
    });

    res.send(courseLesson);
  })
);

route.put(
  '/courses/:id/favorite',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const service = CourseServiceFactory(req.user);
    const courseTracking = await service.upsert(id);

    res.json(courseTracking);
  })
);

export default route;
