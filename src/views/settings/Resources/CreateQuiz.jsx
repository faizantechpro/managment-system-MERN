import { useEffect, useReducer, useState } from 'react';
import Alert from '../../../components/Alert/Alert';
import { v4 as uuidv4 } from 'uuid';

import QuizHeader from '../../../components/quizzes/QuizHeader';
import QuizForm from '../../../components/quizzes/QuizForm';
import quizService from '../../../services/quiz.service';
import { initialQuizState, QUIZ, QUIZ_REVIEW } from '../../../utils/constants';
import stringConstants from '../../../utils/stringConstants.json';
import AlertWrapper from '../../../components/Alert/AlertWrapper';

const constants = stringConstants.settings.resources.quizzes;

const reducer = (state, action) => {
  switch (action.type) {
    case 'set':
      return {
        ...state,
        [action.input]: action.payload,
      };
    case 'edit':
      return {
        ...state,
        ...action.payload,
      };
    case 'reset':
      return initialQuizState;
    default:
      return state;
  }
};

const CreateQuizView = ({ quizId, setQuizId, setCreate }) => {
  const [loading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pages, setPages] = useState([]);
  const [isPublish, setIsPublish] = useState(constants.draftStatus);
  const [removeIds, setRemoveIds] = useState([]);

  const [quizForm, dispatch] = useReducer(reducer, initialQuizState);

  useEffect(() => {
    const getQuizAdmin = async () => {
      const {
        id,
        intro,
        description,
        pages,
        status,
        minimum_score,
        max_attempts,
      } = await quizService.getQuiz(quizId).catch((err) => console.log(err));

      const newPages = pages.slice();

      setPages(newPages);
      setIsPublish(status);

      dispatch({
        type: 'edit',
        payload: {
          id,
          intro,
          description,
          minimum_score,
          max_attempts,
        },
      });
    };

    if (quizId) getQuizAdmin();
  }, [quizId, isPublish]);

  const onAddPage = ({ type, placeholder }) => {
    const newPages = pages.slice();

    const defaultPageObject = {
      id: uuidv4(),
      title: null,
      quiz_id: quizId || null,
      content: null,
      type,
      qtype: null,
      qoption: [],
      points: 1,
      order: pages.length + 1,
      placeholder,
    };

    newPages.push(defaultPageObject);
    setPages(newPages);
  };

  const onHandlePublish = async () => {
    const status =
      isPublish === constants.publishedStatus
        ? constants.draftStatus
        : constants.publishedStatus;

    await quizService
      .createUpdateQuiz({
        id: quizForm.id,
        status,
      })
      .catch((err) => setErrorMessage(err));

    setIsPublish(status);

    setSuccessMessage(
      isPublish === constants.publishedStatus
        ? constants.quizUnpublished
        : constants.quizPublished
    );
  };

  const handleSubmit = async () => {
    if (!quizForm.intro)
      return setErrorMessage(constants.errors.quizTitleError);

    if (quizForm.minimum_score && quizForm.minimum_score < 0) {
      return setErrorMessage(constants.errors.minimumScore);
    }

    if (quizForm.max_attempts && quizForm.max_attempts < 0) {
      return setErrorMessage(constants.errors.maxAttempts);
    }

    const quizExist = pages?.filter((page) => page.type === QUIZ);
    let optionsOutRange = false;
    let optionsWithoutAnswer = false;

    quizExist?.forEach((quiz) => {
      if (
        (quiz?.title && quiz?.qoption.length < 2) ||
        quiz?.qoption.length > 5
      ) {
        optionsOutRange = true;
      }

      const optionCorrectExist = quiz?.qoption?.filter((opt) => opt.correct);

      if (quiz?.title && !optionCorrectExist?.length) {
        optionsWithoutAnswer = true;
      }
    });

    if (quizExist?.length && optionsOutRange) {
      return setErrorMessage(constants.errors.optionsLength);
    }

    if (quizExist?.length && optionsWithoutAnswer) {
      return setErrorMessage(constants.errors.optionAnswer);
    }

    setIsLoading(true);

    const resp = await quizService
      .createUpdateQuiz({
        ...quizForm,
      })
      .catch((err) => setErrorMessage(err));

    if (quizId) {
      const newPages = pages?.map((page, index) => {
        if (page.type !== QUIZ_REVIEW && !page.title) {
          return setErrorMessage(constants.errors.questionTitle);
        }

        if (page.type === QUIZ) {
          return {
            ...page,
            quiz_id: quizId,
            content: '',
            qtype: 'mc',
          };
        }

        return page;
      });

      await quizService
        .createUpdatePages(quizId, newPages, removeIds)
        .catch((err) => console.log(err));

      setSuccessMessage(constants.quizUpdated);
    }

    if (!quizId) {
      const {
        data: { id },
        status,
      } = resp || {};

      if (status === 200) {
        if (pages.length) {
          const newPages = pages.map((page, index) => {
            if (page.type !== QUIZ_REVIEW && !page.title) {
              return setErrorMessage(constants.errors.questionTitle);
            }

            // delete page.id;

            if (page.type === QUIZ) {
              return {
                ...page,
                quiz_id: id,
                content: '',
                qtype: 'mc',
              };
            }

            if (page.type === QUIZ_REVIEW) {
              const title = pages[index - 1].title;
              const content = pages[index - 1].content;

              return {
                ...page,
                quiz_id: id,
                title,
                content,
              };
            }

            return {
              ...page,
              quiz_id: id,
            };
          });

          await quizService
            .createUpdatePages(id, newPages.filter(Boolean))
            .catch((err) => console.log(err));
        }

        setSuccessMessage(constants.quizCreated);
        setQuizId(id);
      }
    }
    setRemoveIds([]);
    setIsLoading(false);
  };

  const onSetPageInfo = ({ pageLocalId, name, value }) => {
    const slicePages = pages.slice();

    const pageSelected = slicePages?.find((page) => page.id === pageLocalId);
    const pageIndex = slicePages?.findIndex((page) => page.id === pageLocalId);

    if (pageSelected) {
      const newPageInfo = {
        ...pageSelected,
        [name]: value,
      };

      slicePages.splice(pageIndex, 1, newPageInfo);

      setPages(slicePages);
    }
  };

  const onRemovePage = (pageLocalId) => {
    const pageIsQuiz = pages.find(
      (page) => page.id === pageLocalId && page.type === QUIZ
    );

    if (pageIsQuiz) {
      delete pages[pageIsQuiz.order];
    }

    if (quizId) {
      const newRemoveIds = removeIds.slice();

      newRemoveIds.push(pageLocalId);

      setRemoveIds(newRemoveIds);
    }

    const newPages = pages?.filter((page) => page.id !== pageLocalId);

    setPages(newPages);
  };

  const onHandleChangeOrder = (result) => {
    const { source, destination } = result;

    if (!source || !destination) return;

    const newOrderPages = pages.slice();

    const [removed] = newOrderPages.splice(source.index, 1);

    newOrderPages.splice(destination.index, 0, removed);

    const newPages = newOrderPages.map((page, index) => ({
      ...page,
      order: index + 1,
    }));

    setPages(newPages);
  };

  return (
    <>
      <section>
        <div>
          <div className="card">
            <QuizHeader
              quizId={quizId}
              handleSubmit={handleSubmit}
              loading={loading}
              onHandlePublish={onHandlePublish}
              isPublish={isPublish}
              goBack={setCreate}
            />

            <QuizForm
              quizId={quizId}
              quizForm={quizForm}
              dispatch={dispatch}
              onAddPage={onAddPage}
              pages={pages}
              onSetPageInfo={onSetPageInfo}
              onRemovePage={onRemovePage}
              setErrorMessage={setErrorMessage}
              onHandleChangeOrder={onHandleChangeOrder}
            />
          </div>
        </div>
      </section>
      <AlertWrapper>
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
        <Alert
          color="success"
          message={successMessage}
          setMessage={setSuccessMessage}
        />
      </AlertWrapper>
    </>
  );
};

export default CreateQuizView;
