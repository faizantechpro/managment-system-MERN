import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { API } from '../../services/api';
import lessonService from '../../services/lesson.service';
import routes from '../../utils/routes.json';
import {
  ADD_TO_LESSON,
  COMPLETED,
  COMPLETED_LESSON,
  CONTINUE_LESSON,
  DRAFT,
  REMOVE_FROM_FAVORITES,
  START_LESSON,
  START_NEW_LESSON,
} from '../../utils/constants';
import { categoriesDefaultInfo } from '../../views/Resources/category/constants/Category.constants';
import TooltipComponent from './Tooltip';
import stringConstants from '../../utils/stringConstants.json';
import AlertWrapper from '../Alert/AlertWrapper';
import Alert from '../Alert/Alert';
import MaterialIcon from '../commons/MaterialIcon';
import { replaceSpaceWithCharacter } from '../../utils/Utils';

const courseConstants = stringConstants.settings.resources.courses;

export default function Hero(props) {
  const {
    title,
    lesson: {
      id,
      pages,
      documents,
      max_points: maxPoints,
      icon,
      category,
      duration,
      status,
    } = {},
    jump,
    next,
    isLast,
    course,
  } = props || {};

  const api = new API();
  const history = useHistory();
  const [label, setLabel] = useState(START_LESSON);
  const [subheading, setSubHeading] = useState('');
  const [completed, setCompleted] = useState(false);
  const [pageId, setPageId] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [points, setMaxpoints] = useState(maxPoints);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const inDraft = status === DRAFT;

  useEffect(() => {
    async function getLastPage() {
      if (isLast()) {
        setSubHeading(COMPLETED_LESSON);

        setCompleted(true);
        const pl = {
          isFirst: false,
          isLast: true,
          progress: 1,
          pageId,
        };

        await api.TrackLesson(id, pl).catch((err) => console.log(err));
        if (course) return setLabel(courseConstants.goBack);

        return setLabel(START_NEW_LESSON);
      }
    }

    getLastPage();

    if (pageId && pageId !== pages[0].id) {
      return setLabel(CONTINUE_LESSON);
    }
    setLabel(START_LESSON);
  }, [pageId]);

  useEffect(() => {
    async function getLessonTrackInfo() {
      const resp = await lessonService
        .GetLessonTrackByLessonId(id)
        .catch((err) => console.log(err));

      if (resp) {
        const {
          page_id: pageId,
          attempts,
          is_favorited: isFavorited,
          points,
          status,
        } = resp;

        setPageId(pageId);

        const lessonPoints =
          points || (attempts < maxPoints ? maxPoints - attempts : 0);

        setMaxpoints(lessonPoints);

        setFavorite(Boolean(isFavorited));
        setIsCompleted(status === COMPLETED);
      }
    }

    getLessonTrackInfo();
  }, []);

  const onStartOrContinue = () => {
    if (course) {
      return history.push(`/training/courses/${course}`);
    }

    if (isLast()) {
      return history.push(
        `${routes.categories}/${replaceSpaceWithCharacter(
          category?.title.toLowerCase()
        )}`
      );
    }

    if (pageId) {
      const jumpTo = pages.find((page) => page.id === pageId);

      if (jumpTo) {
        jump(jumpTo.order + 1);
      }
    } else {
      next();
    }
  };

  async function onHandleFavorite(e) {
    e.preventDefault();
    const favorite = await lessonService.PutFavoriteByLessonId({ id });

    if (favorite) setFavorite((prevState) => !prevState);
  }
  const onDownload = async () => {
    try {
      const file = await lessonService.PdfLinkByLesson(documents);

      if (!file) {
        setErrorMessage('File not found');
        return;
      }

      const data = new Blob([file], { type: 'application/pdf' });
      const fileUrl = window.URL.createObjectURL(data);
      window.open(fileUrl);
    } catch (error) {
      setErrorMessage('File not found');
    }
  };

  return (
    <div className="text-center position-relative active">
      <AlertWrapper>
        <Alert
          message={errorMessage}
          setMessage={setErrorMessage}
          color="danger"
        />
      </AlertWrapper>
      {!completed && (
        <span className="material-icons-outlined font-size-8xl text-primary">
          {category?.icon ||
            icon ||
            categoriesDefaultInfo[category?.title] ||
            'savings'}
        </span>
      )}
      {inDraft && (
        <span className="bg-gray-dark text-white d-inline-block position-absolute top-0 right-0 p-1 px-3 ml-auto font-weight-medium rounded-lg fs-9">
          {DRAFT.toUpperCase()}
        </span>
      )}
      <h3 className="card-title mt-4 mb-2">{title || ''}</h3>
      {completed && (
        <div className="text-center mb-2">
          <p className="card-text text-black mb-2">{subheading}</p>
          <span className="material-icons-outlined font-size-6xl text-success">
            celebration
          </span>
        </div>
      )}
      <button
        type="button"
        className="btn btn-primary btn-pill px-5"
        onClick={onStartOrContinue}
      >
        {label}
      </button>
      <div className="row justify-content-between align-items-center mt-4">
        <div className="col-auto">
          <TooltipComponent
            title={favorite ? REMOVE_FROM_FAVORITES : ADD_TO_LESSON}
            placement="top"
          >
            <button
              className="btn btn-icon btn-icon-sm btn-soft-primary btn-sm rounded-circle cursor-pointer"
              data-original-title={
                favorite ? REMOVE_FROM_FAVORITES : ADD_TO_LESSON
              }
              onClick={(e) => onHandleFavorite(e)}
            >
              <MaterialIcon icon={favorite ? 'favorite' : 'favorite_border'} />
            </button>
          </TooltipComponent>

          {documents && (
            <TooltipComponent title="Download PDF" placement="top">
              <button
                className="btn btn-icon btn-icon-sm btn-soft-primary btn-sm rounded-circle cursor-pointer"
                data-original-title="Add to My Lessons"
                style={{ marginLeft: `10px` }}
                onClick={onDownload}
              >
                <MaterialIcon icon="download_for_offline" clazz="text-reset" />
              </button>
            </TooltipComponent>
          )}

          {isCompleted && (
            <TooltipComponent title="100% Completed">
              <button
                className="mx-1 btn btn-icon btn-icon-sm btn-soft-success no-hover p-2 btn-sm rounded-circle cursor-default"
                onClick={(e) => onDownload(e)}
              >
                <MaterialIcon
                  filled
                  icon="check_circle"
                  clazz="mx-1 text-success font-size-xl"
                />
              </button>
            </TooltipComponent>
          )}
        </div>
        <div
          className="col-auto text-black fs-7"
          data-uw-styling-context="true"
        >
          {points > 0 && (
            <>
              {points} points{' '}
              <span className="legend-indicator bg-primary mx-2"></span>{' '}
            </>
          )}

          {duration && (
            <>
              <span>~{Math.round(duration)} mins </span>{' '}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
