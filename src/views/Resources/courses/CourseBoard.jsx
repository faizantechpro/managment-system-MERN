import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useHistory, useParams } from 'react-router';

import courseService from '../../../services/course.service';
import {
  ProgressBarDefault,
  ProgressCircleDefault,
} from '../../../components/commons/Progress';
import ButtonIcon from '../../../components/commons/ButtonIcon';
import Heading from '../../../components/heading';
import quizService from '../../../services/quiz.service';
import stringConstants from '../../../utils/stringConstants.json';
import { MaxByCriteria, pageTitleBeautify } from '../../../utils/Utils';
import CategoryPartnerLogo from '../../../components/lesson/CategoryPartnerLogo';

const constants = stringConstants.settings.resources.courses;

const HeaderCard = ({
  state,
  onHandleClick,
  progress,
  quizSubmision,
  takeAgain,
}) => {
  const getLabel = () => {
    switch (state) {
      case 'pending':
        return constants.start;
      case 'in_progress':
        return constants.continue;
      case 'completed':
        return constants.takeQuiz;
    }
  };

  const label = getLabel();
  const inProgress = progress === 0 || progress !== undefined;

  return (
    <Row noGutters className="d-flex align-items-center w-100">
      <Col xs={4}>
        <h3>{constants.courseContentLabel}</h3>
      </Col>
      <Col xs={8}>
        <Row noGutters className="d-flex justify-content-end w-100">
          <Col xs={5} className="d-flex align-content-center p-0">
            {inProgress && (
              <ProgressBarDefault
                now={progress}
                variant={progress === 100 ? 'success' : null}
              />
            )}
          </Col>
          <Col xs={5} className="pl-2">
            {(!quizSubmision || state !== 'completed') && (
              <ButtonIcon
                icon={state === 'completed' ? 'assessment' : 'flag'}
                label={label}
                classnames="w-100 btn-sm"
                onclick={onHandleClick}
              />
            )}

            {quizSubmision && state === 'completed' && !takeAgain && (
              <ButtonIcon
                label={
                  quizSubmision?.status === 'pass' ? 'Completed' : 'Failed'
                }
                color={quizSubmision?.status === 'pass' ? 'success' : 'danger'}
                disabled
                classnames="w-100 btn-sm"
              />
            )}

            {quizSubmision && state === 'completed' && takeAgain && (
              <ButtonIcon
                label={
                  quizSubmision?.status === 'pass'
                    ? 'Completed'
                    : 'Failed, try again'
                }
                icon={quizSubmision?.status !== 'pass' ? 'assessment' : null}
                color={quizSubmision?.status === 'pass' ? 'success' : 'warning'}
                disabled={quizSubmision?.status === 'pass'}
                classnames="w-100 btn-sm"
                onclick={onHandleClick}
              />
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const ItemLesson = ({ index, lesson }) => {
  return (
    <Row noGutters className="d-flex align-items-center w-100 px-0">
      <Col>
        <div className="d-flex">
          <h5 className="mb-0 mr-1">{index + 1}.</h5>
          <div>
            <h5 className="mb-0">{lesson.title}</h5>
            <p className="m-0 text-muted font-size-sm">
              {lesson.category?.title || lesson.category}
            </p>
          </div>
        </div>
      </Col>
      <Col className="d-flex justify-content-end">
        <ProgressCircleDefault now={lesson.progress} />
      </Col>
    </Row>
  );
};

const CourseBoard = () => {
  const [currentCourse, setCurrentCourse] = useState({ state: 'progress' });
  const [lessons, setLessons] = useState([]);
  const [quizSubmision, setQuizSubmission] = useState(null);
  const [takeAgain, setTakeAgain] = useState(false);
  const { id: courseId } = useParams();
  const history = useHistory();

  const redirect = (id) => {
    history.push(`/training/lessons/${id}/page/1?courseId=${currentCourse.id}`);
  };

  const titleDefault = pageTitleBeautify([currentCourse?.name, 'Training']);

  const HeadingCourses = () => {
    const title = currentCourse.id ? currentCourse.name : '';
    return (
      <>
        <div className="d-flex align-items-center justify-content-between">
          <Heading title={title} pageHeaderDivider="pb-0 mb-0" />
          <CategoryPartnerLogo
            categoryInfo={currentCourse?.category}
            imageStyle="height-30 ml-1"
          />
        </div>
        <div className="page-header-divider mt-2 mb-3"></div>
      </>
    );
  };

  const startCourse = () => {
    courseService
      .start(courseId)
      .then((course) => {
        const { overall_progress, status } = course;
        setCurrentCourse({ ...currentCourse, state: status, overall_progress });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onHandleClickActionCourse = () => {
    const { state } = currentCourse;
    switch (state) {
      case 'pending':
        startCourse();
        break;
      case 'in_progress': {
        const lesson = lessons.find((item) => item.progress < 100);
        redirect(lesson.id);
        break;
      }
      case 'completed': {
        const { quiz_id } = currentCourse;
        history.push(`/training/courses/${courseId}/quizzes/${quiz_id}`);
        break;
      }
    }
  };

  useEffect(() => {
    const getData = async () => {
      const promises = [
        courseService.getCourseLessonsById(courseId),
        courseService.getCourseProgress(courseId),
      ];
      await Promise.all(promises).then(async ([course, progressCourse]) => {
        if (progressCourse && course) {
          const { status, overall_progress } = progressCourse;
          const { is_learning_path, lessons, quiz_id, ...restProps } = course;

          setCurrentCourse({
            state: status,
            overall_progress,
            is_learning_path,
            quiz_id,
            category: !is_learning_path ? lessons[0]?.category : null,
            ...restProps,
          });

          const lessonIds = lessons.map((lesson) => lesson.id);
          const lessonsCourseProgress =
            await courseService.getlessonCourseProgress(courseId, lessonIds);
          const lessonsProgress = lessons.map((lesson) => {
            const lessonFind = lessonsCourseProgress.find(
              (lessonsCourse) => lessonsCourse.lesson_id === lesson.id
            );

            return {
              ...lesson,
              progress: lessonFind?.progress || 0,
            };
          });

          const lessonsOrder = lessonsProgress.sort((next, prox) => {
            if (
              next.CourseLessonModel.position > prox.CourseLessonModel.position
            ) {
              return 1;
            }
            return -1;
          });

          setLessons(lessonsOrder);

          try {
            const { data } = await quizService.getQuizSubmissions(quiz_id);
            if (data?.length) {
              const max = MaxByCriteria(data);
              setQuizSubmission(max);

              if (max.status !== 'pass') {
                setTakeAgain(data.length < course?.quiz?.max_attempts);
              }
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          history.push('/');
        }
      });
    };
    getData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>{titleDefault}</title>
      </Helmet>
      {HeadingCourses()}
      <Row>
        <Col xs={12} lg={7}>
          <Card className="px-3 h-100">
            <Card.Header className="px-0">
              <HeaderCard
                state={currentCourse.state}
                onHandleClick={onHandleClickActionCourse}
                progress={currentCourse.overall_progress}
                quizSubmision={quizSubmision}
                takeAgain={takeAgain}
              />
            </Card.Header>
            <Card.Body className="p-0">
              {lessons.map((lesson, index) => (
                <Card
                  key={lesson.id}
                  className="my-3  cursor-pointer"
                  onClick={() => redirect(lesson.id)}
                >
                  <Card.Body>
                    <ItemLesson lesson={lesson} index={index} />
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={5}>
          <Card className="px-3 h-100">
            <div>
              <Card.Header className="px-0">
                <h3>{constants.descriptionLabel}</h3>
              </Card.Header>
              <Card.Body className="px-0">
                <p>{currentCourse?.description}</p>
              </Card.Body>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CourseBoard;
