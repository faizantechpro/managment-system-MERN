import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useHistory, useParams } from 'react-router';
import AlertWrapper from '../components/Alert/AlertWrapper';
import Heading from '../components/heading';

import QuestionStep from '../components/questions/Steps';
import courseService from '../services/course.service';
import quizService from '../services/quiz.service';
import stringConstants from '../utils/stringConstants.json';
import Alert from '../components/Alert/Alert';
import { pageTitleBeautify } from '../utils/Utils';

const constants = stringConstants.settings.resources.questions;

const Questionary = () => {
  const { quizId, courseId } = useParams();
  const history = useHistory();
  const [quiz, setQuiz] = useState({});
  const [course, setCourse] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const titleDefault = pageTitleBeautify(['Training', quiz?.intro]);

  const HeadingQuiz = () => {
    let title = '';
    if (quiz?.intro) {
      title = quiz.intro;
    }

    return <Heading title={title} useBc={true} />;
  };

  useEffect(() => {
    const getData = async () => {
      const currentQuiz = await quizService.getQuiz(quizId);
      const currentCourse = await courseService.getCourseLessonsById(courseId);

      if (!currentQuiz && !currentCourse) return history.push('/');

      if (currentQuiz.status !== 'published') {
        setErrorMessage(constants.quizNoPublished);
      }

      setQuiz(currentQuiz);
      setCourse(currentCourse);
    };
    getData();
  }, []);

  return (
    <>
      <Helmet>
        <title>{titleDefault}</title>
      </Helmet>
      <AlertWrapper>
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      {HeadingQuiz()}
      <Card className="px-3">
        <Card.Header className="px-0 fw-bold">{constants.title}</Card.Header>
        <Card.Body>
          {quiz?.status?.toLowerCase() === 'published' && (
            <QuestionStep quiz={quiz} course={course} />
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default Questionary;
