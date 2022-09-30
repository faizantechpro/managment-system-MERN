import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import { Course, CourseProgress, CourseLesson, Lesson } from '../database';
import { CourseProgressAttributes } from '../database/models/course-progress';
import { BadgeAttributes } from '../database/models/badge';
import { CourseAttributes, CourseModel } from '../database/models/course';
import { LessonAttributes } from '../database/models/lesson';
import { QuizAttributes } from '../database/models/quiz';
import {
  Forbidden,
  InvalidPayload,
  ResourceNotFound,
} from 'lib/middlewares/exception';
import Base from './utils/Base';
import { AuthUser } from 'lib/middlewares/auth';
import { LessonServiceFactory } from './lesson';
import { LessonTrackingAttributes } from 'lib/database/models/lesson-tracking';

// Virtual columns for course progress calculated on request
type Progress = {
  status: 'pending' | 'in_progress' | 'completed';
  completed_modules?: number; // sum of all completed modules (for now only lessons)
  required_modules?: number; // sum of all required modules (for now only lessons)
  overall_progress?: number; // the overall progress percentage (CEIL(completed/required)
};

// TODO need to find a better way to make a generic type with include
type GetCourseLessonById = CourseAttributes & { badge: BadgeAttributes } & {
  quiz: QuizAttributes;
} & { lessons: LessonAttributes[] };

class CourseService extends Base<CourseModel> {
  getContextQuery() {
    return {};
  }

  async findCourse(courseId: string) {
    const course = await Course.findOne({
      where: { id: courseId },
    });

    return course;
  }

  async removeCourses(keys: string[]) {
    for (const key of keys) {
      const course = await Course.findOne({ where: { id: key } });

      // TODO this should be 404..............
      if (!course) throw new Forbidden();

      await course.update({ deleted: true });
    }
  }

  async createCourseWithLessons(data: any) {
    const { lessons, ...restProps } = data;

    const newCourse = {
      id: uuidv4(),
      deleted: false,
      ...restProps,
    };

    if (newCourse.status === 'published' && this.user.auth.isAdmin) {
      newCourse.isPublic = true;
    }

    const { id } = await Course.create(newCourse);
    const newCourseLesson = lessons.map((lesson: number, index: number) => ({
      lesson_id: lesson,
      course_id: id,
      position: index,
    }));

    await CourseLesson.bulkCreate(newCourseLesson);
    const courseLesson = await this.getCourseLessonById(id);

    return courseLesson;
  }

  async getCourseLessonById(
    id: string
  ): Promise<undefined | GetCourseLessonById> {
    const courseLesson = await Course.findByPk(id, {
      include: [
        'badge',
        'quiz',
        'category',
        {
          model: Lesson,
          as: 'lessons',
          include: ['category'],
          through: { attributes: ['position', 'id'] },
        },
      ],
    });

    return courseLesson?.dataValues as GetCourseLessonById;
  }

  async updateCourseWithLessons(data: any) {
    const {
      id,
      is_learning_path,
      category_id,
      lessons,
      removedLessons,
      ...restProps
    } = data;

    const newCourse = {
      is_learning_path,
      category_id: !is_learning_path ? category_id : null,
      ...restProps,
    };

    const course = await Course.findByPk(id);
    if (!course) throw new ResourceNotFound('course');

    if (
      newCourse.status === 'published' &&
      this.user.auth.isAdmin &&
      this.user.tenant === course.tenant_id
    ) {
      newCourse.isPublic = true;
    }

    await Course.update(newCourse, { where: { id } });
    await CourseLesson.destroy({ where: { id: removedLessons } });

    const newCourseLesson = lessons.map((lesson: number, index: number) => ({
      lesson_id: lesson,
      course_id: id,
      position: index,
    }));

    await CourseLesson.bulkCreate(newCourseLesson, {
      updateOnDuplicate: ['lesson_id', 'course_id', 'position'],
    });
    const courseLesson = await this.getCourseLessonById(id);

    return courseLesson;
  }

  async updateCourse(id: string, data: any) {
    const course = await Course.findByPk(id);
    if (!course) throw new InvalidPayload('the course don´t exist');

    if (
      data.status === 'published' &&
      this.user.auth.isAdmin &&
      course.tenant_id === this.user.tenant
    ) {
      data.isPublic = true;
    }

    await Course.update(data, { where: { id } });
  }

  async getCompletedCoursesInfo() {
    const coursesTracking = await CourseProgress.findAndCountAll({
      attributes: [
        'course_id',
        'started_at',
        'completed_at',
        'last_attempted_at',
      ],
      where: {
        user_id: this.user.id,
        completed_at: { [Op.ne]: null },
      },
      include: [
        {
          attributes: ['id'],
          model: Course,
          include: ['badge'],
        },
      ],
    });

    return coursesTracking;
  }

  /**
   * Starts a course and initializes a progress tracking.
   *
   * Starting a course is limited to 1 entry per user_id + course_id
   */
  async start(courseId: string) {
    const courseProgressPayload: CourseProgressAttributes = {
      id: uuidv4(),
      tenant_id: this.user.tenant,
      user_id: this.user.id,
      course_id: courseId,
      started_at: new Date(),
      last_attempted_at: new Date(),
    };

    await CourseProgress.create(courseProgressPayload);

    // user can have a 'completed' status immediately as they could have completed required course lessons
    return await this.getProgress(this.user.tenant);
  }

  async complete(courseId: string) {
    const courseProgress = await CourseProgress.findOne({
      where: {
        user_id: this.user.id,
        course_id: courseId,
        tenant_id: this.user.tenant,
      },
    });

    if (!courseProgress) throw new ResourceNotFound('course progress');

    await courseProgress.update({ completed_at: new Date() });

    return await this.getProgress(courseId);
  }

  /**
   * Gets progress of a course. If course has not been started, returns default
   * object indicating no progress.
   */
  async getProgress(
    courseId: string
  ): Promise<
    | (CourseProgressAttributes & Progress)
    | (Omit<CourseProgressAttributes, 'id' | 'tenant_id'> & Progress)
  > {
    const progress = await CourseProgress.findOne({
      where: {
        course_id: courseId,
        user_id: this.user.id,
        tenant_id: this.user.tenant,
      },
    });

    if (!progress) {
      // user has not started course, leave everything in a default state
      return {
        course_id: courseId,
        is_favorite: false,
        user_id: this.user.id,
        status: 'pending',
      };
    }

    const course = await this.getCourseLessonById(courseId);
    if (!course) {
      throw new ResourceNotFound('course');
    }
    const lessonService = LessonServiceFactory(this.user);
    const trackedLessons = await Promise.all(
      course.lessons.map(({ id }) => {
        return lessonService.track(id!);
      })
    );
    const completedModules = trackedLessons
      .filter((trackedLesson) => !!trackedLesson)
      .reduce((acc, trackedLesson) => {
        const status = trackedLesson?.getDataValue('status');
        return acc + (status === 'completed' ? 1 : 0);
      }, 0);

    const requiredModules = course.lessons.length;
    const overallProgress = Math.ceil(
      (completedModules / requiredModules) * 100
    );

    return {
      ...progress.dataValues,
      status: overallProgress >= 100 ? 'completed' : 'in_progress',
      completed_modules: completedModules,
      required_modules: requiredModules,
      overall_progress: overallProgress,
    };
  }

  /**
   * Gets the individual lesson progress for a course. This prevents N requests
   * to individual lesson progress in a view where we want to display all lesson
   * progress
   */
  async getLessonProgress(courseId: string, lessonIds?: number[]) {
    const course = await this.getCourseLessonById(courseId);
    if (!course) {
      throw new ResourceNotFound('course');
    }

    if (!lessonIds) {
      lessonIds = course.lessons.filter(({ id }) => !!id).map(({ id }) => id!);
    }

    // course can possibly have no lessons associated to it
    if (!lessonIds.length) {
      return [];
    }

    const lessonService = LessonServiceFactory(this.user);
    const lessonTrack: any = await lessonService.trackBulk(lessonIds);

    // force cast for now..
    return lessonTrack.map(
      (track: any) => track.dataValues
    ) as LessonTrackingAttributes[];
  }

  async upsert(courseId: string) {
    const courseProgress: any = await CourseProgress.findOne({
      where: {
        course_id: courseId,
        user_id: this.user.id,
        tenant_id: this.user.tenant,
      },
    });

    const newTracking: CourseProgressAttributes = {
      id: courseProgress?.id || uuidv4(),
      user_id: this.user.id,
      course_id: courseId as string,
      started_at: new Date(),
      last_attempted_at: new Date(),
      is_favorite: !courseProgress?.is_favorite,
      tenant_id: this.user.tenant,
    };

    const [instance] = await CourseProgress.upsert(newTracking, {
      returning: true,
    });

    return instance;
  }
}

export class AdminCourseService extends CourseService {
  getContextQuery() {
    return {};
  }
}
export class OwnerCourseService extends CourseService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export class UserCourseService extends CourseService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export function CourseServiceFactory(user: AuthUser) {
  if (user?.auth?.isAdmin) {
    return new AdminCourseService(Course, user);
  } else if (user?.auth?.isOwner) {
    return new OwnerCourseService(Course, user);
  }
  return new UserCourseService(Course, user);
}
