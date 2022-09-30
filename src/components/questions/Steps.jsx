import React, { useEffect, useState } from 'react';
import { Step, Steps } from 'react-step-builder';

import quizService from '../../services/quiz.service';
import courseService from '../../services/course.service';
import ItemStep from './ItemStep';
import Navigation from './Navigation';
import ReviewQuiz from './Review';
import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import stringConstants from '../../utils/stringConstants.json';
import { MaxByCriteria } from '../../utils/Utils';
import { useParams } from 'react-router';
const constants = stringConstants.settings.resources.questions;

const QuestionStep = ({ course }) => {
  const { quizId } = useParams();
  const [checked, setCheked] = useState(null);
  const [select, setSelect] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submission, setSubmission] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [tryAgain, setTryAgain] = useState(true);
  const [loading, setLoading] = useState(false);

  const saveFinishQuiz = async (questions) => {
    setLoading(true);
    const responses = questions.map(({ question_id, id }) => {
      return { question_id, id };
    });

    try {
      const { id, max_attempts } = currentQuiz;
      const { data } = await quizService.finishTakeQuiz(id, responses);
      const { data: submissions } = await quizService.getQuizSubmissions(
        quizId
      );

      if (data.status !== 'pass') {
        setTryAgain(submissions.length < max_attempts);
      } else {
        setTryAgain(false);
      }

      if (course?.id) {
        await courseService.complete(course?.id);
      }

      setSubmission(data);
    } catch (e) {
      setErrorMessage(constants.errorSaveQuestionary);
    } finally {
      setLoading(false);
    }
  };

  const onClickHandle = (next, isLast) => {
    if (checked !== null) {
      if (isLast) {
        saveFinishQuiz([...answers, { ...checked }]);
      } else {
        setSelect(null);
        setCheked(null);
        setAnswers([...answers, { ...checked }]);
      }

      next();
    } else {
      setErrorMessage(constants.chooseAnswer);
    }
  };

  const onHandleChange = (opt) => {
    const { id } = opt;
    setSelect(id);
    setCheked(opt);
  };

  const nav = (props) => <Navigation {...props} onClick={onClickHandle} />;

  const config = {
    navigation: {
      component: nav,
      location: 'after',
    },
  };

  const onHadleReset = async () => {
    setSelect(null);
    setCheked(null);
    setAnswers([]);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const quiz = await quizService.getQuiz(quizId);
        setCurrentQuiz(quiz);
        const { data } = await quizService.getQuizSubmissions(quizId);
        if (data?.length > 0) {
          const max = MaxByCriteria(data);
          setSubmission(max);

          if (max.status !== 'pass') {
            setTryAgain(data.length < quiz.max_attempts);
          } else {
            setTryAgain(false);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, [quizId]);

  return (
    <div className="my-6">
      <AlertWrapper>
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>

      {tryAgain && (
        <Steps config={config}>
          {currentQuiz?.pages?.map((page, index) => (
            <Step
              key={index}
              title={`step-${index}`}
              component={(props) => (
                <div>
                  <ItemStep
                    {...props}
                    page={page}
                    index={index}
                    count={currentQuiz?.pages.length}
                    onHandleChange={onHandleChange}
                    select={select}
                  />
                </div>
              )}
            />
          ))}

          <Step
            title="Review"
            component={(props) => (
              <ReviewQuiz
                {...props}
                loading={loading}
                tryAgain={tryAgain}
                minimun={currentQuiz?.minimum_score}
                badge={course?.badge}
                submission={submission}
                onHadleReset={onHadleReset}
              />
            )}
          />
        </Steps>
      )}

      {!tryAgain && (
        <ReviewQuiz
          loading={loading}
          minimun={currentQuiz?.minimum_score}
          badge={course?.badge}
          submission={submission}
        />
      )}
    </div>
  );
};

export default QuestionStep;
