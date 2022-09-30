import { useEffect, useReducer } from 'react';
import { Input } from 'reactstrap';

import { initialOptionsState } from './ManageLessonsConstants';
import TooltipComponent from '../lesson/Tooltip';

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
      return initialOptionsState;
    default:
      return state;
  }
}

const LessonAdminQuizOption = (props) => {
  const { opt, onRemoveOption, onSetOptionInfo, lessonId } = props;
  const [optionForm, dispatch] = useReducer(reducer, initialOptionsState);

  useEffect(() => {
    const setOptions = () => {
      dispatch({
        type: 'set',
        input: 'answer',
        payload: opt.answer,
      });
    };

    if (lessonId) setOptions();
  }, []);

  const onInputChange = (e) => {
    const { name, value } = e.target;

    dispatch({
      type: 'set',
      input: name,
      payload: value,
    });

    onSetOptionInfo({ optionId: opt.id, name, value });
  };

  const onSelectAnswer = () => {
    dispatch({
      type: 'set',
      input: 'correct',
      payload: !opt.correct,
    });

    onSetOptionInfo({
      optionId: opt.id,
      name: 'correct',
      value: !opt.correct,
    });
  };

  return (
    <div className="option-wrapper">
      <p className="d-flex m-0 align-items-center p-2 w-100">
        <span
          className="material-icons-outlined mr-2 cursor-pointer"
          data-uw-styling-context="true"
          onClick={onSelectAnswer}
        >
          {!opt.correct ? 'radio_button_unchecked' : 'radio_button_checked'}
        </span>
        <Input
          type="text"
          name="answer"
          id="answer"
          className="border-0 bg-transparent"
          placeholder="Option"
          value={optionForm.answer || ''}
          onChange={onInputChange}
        />
      </p>

      <TooltipComponent title="Remove Option">
        <span
          className="material-icons-outlined mr-2 text-danger cursor-pointer"
          data-uw-styling-context="true"
          onClick={() => onRemoveOption(opt.id)}
        >
          delete
        </span>
      </TooltipComponent>
    </div>
  );
};

export default LessonAdminQuizOption;
