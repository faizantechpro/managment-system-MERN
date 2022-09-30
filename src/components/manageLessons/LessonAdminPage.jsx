import { useEffect, useReducer, useState } from 'react';
import { Button, Input, FormGroup } from 'reactstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import LessonAdminQuizOption from './LessonAdminQuizOptions';
import { abcId, initialOptionsState } from './ManageLessonsConstants';
import WistiaEmbed from '../wistia';
import {
  CONTENT_LABEL,
  QUESTION_REVIEW_LABEL,
  QUIZ,
  SELECT_OPTIONS_DESCRIPTION,
  SLIDE_DEFAULT_TEXT,
  TITLE_LABEL,
  VIDEO,
} from '../../utils/constants';
import MaterialIcon from '../commons/MaterialIcon';
import TableActions from '../commons/TableActions';

const LessonAdminPage = (props) => {
  const {
    type,
    id,
    title,
    placeholder,
    content,
    qoption,
    onSetPageInfo,
    onRemovePage,
    lessonId,
    isNew,
  } = props;

  const [minimize, setMinimize] = useState(!isNew);
  const [quizOptions, setQuizOptions] = useState([]);
  const [videoLink, setVideoLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [videoId, setVideoId] = useState(null);
  const slideIcons = {
    video: 'smart_display',
    slide: 'description',
    quiz: 'analytics',
  };

  const initialLessonPagesState = {
    type,
    placeholder,
    title: '',
    lessonId: '',
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
        input: 'lessonId',
        payload: lessonId,
      });

      dispatch({
        type: 'set',
        input: CONTENT_LABEL,
        payload: content,
      });

      if (type === VIDEO) {
        setVideoLink(content);
        onCheckLink(content);
      }

      setQuizOptions(qoption);
    };

    if (lessonId) setPageData();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [pagesForm.content]);

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

  const onCheckLink = (link) => {
    if (link) {
      const videoRegex =
        /https?:\/\/(.+)?(identifee.wistia\.com|wi\.st)\/(medias)\//;

      const videoId = link.replace(videoRegex, '');

      dispatch({
        type: 'set',
        input: CONTENT_LABEL,
        payload: link,
      });

      onSetPageInfo({
        pageLocalId: id,
        name: CONTENT_LABEL,
        value: link,
      });

      setVideoId(videoId);
    }
  };

  const onAddLink = (e) => {
    setLoading(true);
    onCheckLink(e.target.value);
  };

  const actionItems = [
    {
      id: 1,
      title: 'Edit',
      icon: minimize ? 'add' : 'remove',
      onClick: () => setMinimize(!minimize),
    },
    {
      id: 2,
      title: 'Delete',
      icon: 'delete',
      onClick: () => onRemovePage(id),
      style: 'ml-2 text-danger',
    },
  ];

  // just removing image/video upload from editor, need an extra logic to place custom file uploader plugin as ckeditor suggests
  const defaultConfig = { ...ClassicEditor.defaultConfig };
  defaultConfig.toolbar.removeItems = ['uploadImage', 'mediaEmbed'];
  ClassicEditor.defaultConfig = { ...defaultConfig };

  return (
    <div
      className={`card rounded mb-3 ${
        pagesForm.type === 'quiz_review' && 'd-none'
      }`}
    >
      <div
        className="d-flex align-items-center justify-content-between p-3"
        onClick={() => setMinimize(!minimize)}
      >
        <div>
          <span
            className="material-icons-outlined cursor-grab mr-1"
            data-uw-styling-context="true"
          >
            drag_indicator
          </span>
          <span className="text-primary cursor-pointer fw-bold">
            <MaterialIcon icon={slideIcons[pagesForm.type]} />{' '}
            {pagesForm.title ? pagesForm.title : SLIDE_DEFAULT_TEXT}
          </span>
        </div>

        <TableActions item={{ id }} actions={actionItems} />
      </div>

      <div className={`dropdown-divider m-0`} />

      <div className={minimize ? 'd-none' : 'd-block'}>
        {type !== VIDEO && (
          <div className="p-3 cursor-text" onSubmit={(e) => e.preventDefault()}>
            <FormGroup className="d-flex pb-1 justify-content-between align-items-center">
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

            {type === QUIZ && (
              <div className="text-center pb-0 pt-0 d-gray">
                <p>{SELECT_OPTIONS_DESCRIPTION}</p>

                {quizOptions?.map((opt) => (
                  <LessonAdminQuizOption
                    lessonId={lessonId}
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
                  disabled={quizOptions.length > 4}
                >
                  <span
                    className="material-icons-outlined mr-2"
                    data-uw-styling-context="true"
                  >
                    add_circle
                  </span>
                  Add Option
                </Button>
              </div>
            )}

            {type === QUIZ && (
              <h4 className="pb-3 pt-1 mb-0">{QUESTION_REVIEW_LABEL}</h4>
            )}

            <CKEditor
              editor={ClassicEditor}
              className="border border-gray-200"
              data={content || ''}
              onChange={(_, editor) => {
                const data = editor.getData();
                dispatch({
                  type: 'set',
                  input: CONTENT_LABEL,
                  payload: data,
                });

                onSetPageInfo({
                  pageLocalId: id,
                  name: CONTENT_LABEL,
                  value: data,
                });
              }}
            />
          </div>
        )}

        {type === VIDEO && (
          <div>
            <FormGroup className="p-3 pb-0">
              <Input
                type="text"
                name="title"
                id="title"
                className="w-100 mb-3"
                placeholder="Title"
                value={pagesForm.title || ''}
                onChange={onInputChange}
              />

              <Input
                type="text"
                name="content"
                id="content"
                className="w-100"
                placeholder={placeholder}
                value={videoLink}
                onChange={(e) => {
                  setVideoLink(e.target.value);
                  onAddLink(e);
                }}
              />
            </FormGroup>

            <div id="wistia-admin">
              {!loading && videoId ? (
                <div className="px-3 pt-2 pb-3" style={{ width: 610 }}>
                  <WistiaEmbed
                    hashedId={videoId || ''}
                    isResponsive={true}
                    videoFoam={true}
                  />
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonAdminPage;
