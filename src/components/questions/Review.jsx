import React from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router';

import ButtonIcon from '../commons/ButtonIcon';
import './style.css';
import failedIcon from '../../assets/png/quizz-fail.png';
import stringConstants from '../../utils/stringConstants.json';

const constants = stringConstants.settings.resources.questions;

const WinCourse = ({ badge }) => {
  const { courseId } = useParams();
  const history = useHistory();

  const message = `Congratulations you earned the ${badge?.name} badge!`;

  return (
    <Row noGutters className="d-flex justify-content-center w-100">
      <Col xs={12} className="d-flex justify-content-center">
        <p className="max-w-50 fs-5 text-center">{message}</p>
      </Col>
      <Col xs={12} className="text-center mt-2">
        <ButtonIcon
          label={constants.goToCourse}
          classnames="btn-sm"
          onclick={() => history.push(`/training/courses/${courseId}`)}
        />
      </Col>
    </Row>
  );
};

const FailedQuizz = ({ minScore, score, again, onClickTakeAgain }) => {
  const { courseId } = useParams();
  const history = useHistory();

  const message = `Your score of ${score}% is not higher than ${minScore}% to pass this quiz`;

  return (
    <Row noGutters className="d-flex justify-content-center w-100">
      <Col className="d-flex justify-content-center mb-4">
        <img src={failedIcon} />
      </Col>
      <Col xs={12} className="d-flex justify-content-center">
        <p className="max-w-50 fs-5 text-center">{message}</p>
      </Col>
      <Col xs={12} className="text-center mt-2">
        <ButtonIcon
          color="white"
          label={constants.review}
          classnames="btn-sm border-secondary"
          onclick={() => history.push(`/training/courses/${courseId}`)}
        />
        {again && (
          <ButtonIcon
            label={constants.takeAgain}
            classnames="btn-sm ml-2"
            onclick={onClickTakeAgain}
          />
        )}
      </Col>
    </Row>
  );
};

const ReviewQuiz = ({
  minimun,
  badge,
  jump,
  tryAgain = false,
  onHadleReset,
  submission,
  prueba,
  loading,
}) => {
  const onHandleTakeAgain = () => {
    onHadleReset();
    jump(1);
  };

  if (!loading) {
    return (
      <div>
        {submission && submission?.status !== 'pass' && (
          <FailedQuizz
            minScore={minimun}
            again={tryAgain}
            score={submission.score}
            onClickTakeAgain={onHandleTakeAgain}
          />
        )}
        {submission && submission?.status === 'pass' && (
          <WinCourse badge={badge} />
        )}
      </div>
    );
  }
  return (
    <div className="d-flex justify-content-center w-100">
      <Spinner />
    </div>
  );
};

export default ReviewQuiz;
