import { useEffect, useReducer, useState } from 'react';
import { Button, Input, FormGroup, Form } from 'reactstrap';

import LessonAdminQuizOption from '../manageLessons/LessonAdminQuizOptions';
import {
  abcId,
  initialOptionsState,
} from '../manageLessons/ManageLessonsConstants';
import {
  CONTENT_LABEL,
  QUIZ,
  SELECT_OPTIONS_DESCRIPTION,
  SLIDE_DEFAULT_TEXT,
  TITLE_LABEL,
} from '../../utils/constants';

const QuizAdminPage = (props) => {
  const {
    quizId,
    type,
    id,
    title,
    points,
    placeholder,
    content,
    qoption,
    onSetPageInfo,
    onRemovePage,
  } = props;

  const [minimize, setMinimize] = useState(false);
  const [quizOptions, setQuizOptions] = useState([]);

  const initialLessonPagesState = {
    type,
    placeholder,
    points: 1,
    title: '',
    quizId: '',
    content: '',
  };

  function reducer(state, action) {
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
        return initialLessonPagesState;
      default:
        return state;
    }
  }

  const [pagesForm, dispatch] = useReducer(reducer, initialLessonPagesState);

  useEffect(() => {
    const setPageData = () => {
      dispatch({
        type: 'set',
        input: TITLE_LABEL,
        payload: title,
      });

      dispatch({
        type: 'set',
        input: 'points',
        payload: points,
      });

      dispatch({
        type: 'set',
        input: 'quizId',
        payload: quizId,
      });

      dispatch({
        type: 'set',
        input: CONTENT_LABEL,
        payload: content,
      });

      setQuizOptions(qoption);
    };

    if (quizId) setPageData();
  }, []);

  const onInputChange = (e) => {
    const { name, value } = e.target;

    dispatch({
      type: 'set',
      input: name,
      payload: value,
    });

    onSetPageInfo({ pageLocalId: id, name, value });
  };

  const onAddQuizOption = () => {
    const newQuizOptions = quizOptions.slice();

    newQuizOptions.push({
      id: abcId[quizOptions.length],
      ...initialOptionsState,
    });

    setQuizOptions(newQuizOptions);
  };

  const onRemoveOption = (optionId) => {
    const newQuizOptions = quizOptions?.filter((page) => page.id !== optionId);

    setQuizOptions(newQuizOptions);

    onSetPageInfo({
      pageLocalId: id,
      name: 'qoption',
      value: newQuizOptions,
    });
  };

  const onSetOptionInfo = ({ optionId, name, value }) => {
    const sliceQuizOptions = quizOptions.map((opt) => ({
      ...opt,
      correct: false,
    }));

    const optionSelected = sliceQuizOptions?.find(
      (page) => page.id === optionId
    );
    const optionsIndex = sliceQuizOptions?.findIndex(
      (page) => page.id === optionId
    );

    if (optionSelected) {
      const newOptionInfo = {
        ...optionSelected,
        [name]: value,
      };

      sliceQuizOptions.splice(optionsIndex, 1, newOptionInfo);

      setQuizOptions(sliceQuizOptions);
      onSetPageInfo({
        pageLocalId: id,
        name: 'qoption',
        value: sliceQuizOptions,
      });
    }
  };

  return (
    <div
      className={`card rounded mb-4 ${
        pagesForm.type === 'quiz_review' && 'd-none'
      }`}
    >
      <div className="d-flex justify-content-between px-4 py-2">
        <div>
          <span className="material-icons-outlined mr-2">drag_indicator</span>
          <span className="text-primary fw-bold">
            {pagesForm.title ? pagesForm.title : SLIDE_DEFAULT_TEXT}
          </span>
        </div>

        <span
          className="material-icons-outlined mr-2 cursor-pointer"
          onClick={() => setMinimize((prev) => !prev)}
        >
          {!minimize ? 'minimize' : 'add'}
        </span>
      </div>

      <div className={`dropdown-divider mt-2 ${minimize ? 'mb-0' : 'mb-2'} `} />

      <div className={minimize ? 'd-none' : 'd-block'}>
        {type === QUIZ && (
          <div className="p-3 mb-4" onSubmit={(e) => e.preventDefault()}>
            <Form className="justify-content-around" inline>
              <FormGroup className="w-75">
                <Input
                  type="text"
                  name="title"
                  id="title"
                  className="w-100"
                  placeholder={placeholder}
                  value={pagesForm.title || ''}
                  onChange={onInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="number"
                  name="points"
                  id="points"
                  placeholder="Points"
                  value={pagesForm.points}
                  onChange={onInputChange}
                />
              </FormGroup>
            </Form>

            <div className="text-center d-gray">
              <p>{SELECT_OPTIONS_DESCRIPTION}</p>

              {quizOptions?.map((opt) => (
                <LessonAdminQuizOption
                  lessonId={quizId}
                  key={opt.id}
                  opt={opt}
                  pageLocalId={id}
                  onRemoveOption={onRemoveOption}
                  onSetOptionInfo={onSetOptionInfo}
                />
              ))}

              <Button
                color="primary"
                className="w-100 mb-3"
                onClick={onAddQuizOption}
              >
                <span className="material-icons-outlined mr-2">add_circle</span>
                Add Option
              </Button>
            </div>
          </div>
        )}

        <div className="dropdown-divider mt-2 mb-2" />

        <div className="d-flex justify-content-end button-delete-icon">
          <span
            className="material-icons-outlined m-3 cursor-pointer"
            onClick={() => onRemovePage(id)}
          >
            delete
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuizAdminPage;
