import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';
import { useLocation } from 'react-router-dom';

import WistiaEmbed from '../wistia';
import { API } from '../../services/api';
import lessonService from '../../services/lesson.service';
import {
  CLOSE,
  CORRECT_LABEL,
  NOT_QUITE,
  QUIZ,
  QUIZ_REVIEW,
  RETAKE_LABEL,
  SLIDE,
  VIDEO,
} from '../../utils/constants';

function Correct() {
  return (
    <>
      <img
        className="avatar avatar-md mb-3"
        src="/img/components/check-bg-green.svg"
        alt="Image Description"
      />
      <div
        className="h2 font-weight-bolder text-success mb-4"
        data-uw-styling-context="true"
      >
        {CORRECT_LABEL}
      </div>
    </>
  );
}

function Incorrect({ jump, lessonId, firstPage, state }) {
  const api = new API();

  async function onResetTracks() {
    const pl = {
      isFirst: false,
      isLast: false,
      progress: 0,
      pageId: firstPage.id,
    };

    const resp = await api
      .TrackLesson(lessonId, pl)
      .catch((err) => console.log(err));

    if (resp) {
      state.disable_nav = false;
      state.disable_progress = false;
      jump(1);
    }
  }

  return (
    <>
      <i
        className="material-icons-outlined"
        style={{ color: '#f44336', fontSize: '4rem' }}
      >
        {CLOSE}
      </i>
      <div
        className="h2 font-weight-bolder text-danger mb-4"
        data-uw-styling-context="true"
      >
        {NOT_QUITE}
      </div>
      <div
        className="btn btn-primary btn-pill px-5 cursor-pointer"
        onClick={onResetTracks}
      >
        {RETAKE_LABEL}
      </div>
    </>
  );
}

export default function Page(props) {
  const {
    isFirst,
    isLast,
    progress,
    page,
    title,
    jump,
    state,
    next,
    lessonId,
    firstPage,
  } = props;

  const api = new API();
  const location = useLocation();

  const [track, setTrack] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPreview = location.search === '?preview';

  const submitAnswer = async () => {
    const answer = state.userAnswer;
    setLoading(true);
    const resp = await lessonService
      .SubmitAnswer(page.lesson_id, page.id, answer)
      .catch((err) => console.log(err));

    if (resp.success) {
      state.disable_nav = false;
      state.disable_progress = false;
      state.retake = false;
      state.correctAnswer = answer;
    } else {
      state.disable_progress = true;
      state.retake = true;
    }

    next();
  };

  const setUserAnswer = (e) => {
    setShowCheck(true);
    props.state.userAnswer = e.target.value;
  };

  const getVideoId = (url) => {
    // strip any html tags
    url = url.replace(/(<([^>]+)>)/gi, '');
    if (url.indexOf('https://') !== -1) {
      const parts = url.split('/');
      return parts[parts.length - 1];
    }
    return url;
  };

  const trackLesson = () => {
    const pl = {
      isFirst: isFirst(),
      isLast: isLast(),
      progress: progress,
      pageId: page.id,
    };

    return api.TrackLesson(page.lesson_id, pl);
  };

  useEffect(() => {
    if (page.type === QUIZ) {
      props.state.disable_nav = true;
    }

    if (!track && !isPreview) {
      setTrack(true);
      trackLesson()
        .then((e) => console.log)
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div>
      <h2 className="card-title fw-bolder text-center mb-4">{title}</h2>

      {page.type === SLIDE && (
        <div
          className="text-lext font-size-sm slide"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      )}

      {page.type === QUIZ && (
        <div className="text-lext">
          <Form className="font-size-sm">
            {page.qoption?.map((opt, indx) => (
              <FormGroup
                key={indx}
                check
                className="custom-control custom-radio mb-2"
              >
                <Label check className="text-black">
                  <Input
                    type="radio"
                    name="quiz-option"
                    value={opt.id}
                    onChange={setUserAnswer}
                  />
                  {`${opt.id}. ${opt.answer}`}
                </Label>
              </FormGroup>
            ))}
            {showCheck && (
              <Button className="btn btn-primary" onClick={submitAnswer}>
                {loading ? (
                  <Spinner className="spinner-grow-xs" />
                ) : (
                  'Submit Answer'
                )}
              </Button>
            )}
          </Form>
        </div>
      )}
      {page.type === QUIZ_REVIEW && (
        <div>
          <div className="text-center slide">
            {state.userAnswer && state.userAnswer === state.correctAnswer ? (
              <>
                <Correct />
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
              </>
            ) : (
              <Incorrect
                jump={jump}
                lessonId={lessonId}
                firstPage={firstPage}
                state={state}
              />
            )}
          </div>
        </div>
      )}

      {page.type === VIDEO && (
        <div style={{ width: 810, margin: '0 auto' }}>
          <div style={{ width: '100%', margin: '0 auto' }}>
            <WistiaEmbed
              hashedId={getVideoId(props.page.content)}
              isResponsive={true}
              videoFoam={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
