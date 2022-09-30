import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Row,
  Col,
  Progress,
  Spinner,
} from 'reactstrap';
import { Link } from 'react-router-dom';

import {
  COMPLETED,
  PRIMARY,
  DRAFT,
  ADD_TO_LESSON,
  REMOVE_FROM_FAVORITES,
} from '../../utils/constants';
import LessonService from '../../services/lesson.service';
import TooltipComponent from './Tooltip';
import CardStack from './CardStack';
import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import { CategoriesContext } from '../../contexts/categoriesContext';
import courseService from '../../services/course.service';
import MaterialIcon from '../commons/MaterialIcon';

export default function LessonCard(props) {
  const { icon, item, sectionType, setItem } = props;
  const { id } = item;
  const track =
    item.progress && item.progress.length > 0
      ? item.progress[0] || false
      : false;
  const { categoryList } = useContext(CategoriesContext);

  const [errorMessage, setErrorMessage] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [favoriteInProgress, setFavoriteInProgress] = useState(false);

  const [isCompleted, setIsCompleted] = useState(
    track && track.status === COMPLETED
  );

  const isCourse = sectionType === 'course';
  const progress = track ? track.progress : 0;
  const { category_id } = item;
  const categoryInfo = categoryList?.find((cat) => cat.id === category_id);
  const category = item.category?.title || categoryInfo?.title;
  const path = !isCourse
    ? `/training/lessons/${item.id}`
    : `/training/courses/${item.id}`;
  const link = track && track.page_id ? `${path}/page/${track.page_id}` : path;

  const inDraft = item?.status === DRAFT || !item.status;

  const textColor = isCompleted
    ? `text-${PRIMARY}`
    : inDraft
    ? `text-${PRIMARY}`
    : `text-${PRIMARY}`;
  const progressColor = isCompleted
    ? `bg-${PRIMARY}`
    : inDraft
    ? `bg-${PRIMARY}`
    : `bg-${PRIMARY}`;

  useEffect(async () => {
    if (!isCourse) {
      const resp = await LessonService.GetLessonTrackByLessonId(id);

      if (resp) {
        const { completed_at, progress } = resp;

        if (progress === 100 && completed_at) {
          setIsCompleted(true);
        }

        return setFavorite(Boolean(resp.is_favorited));
      } else {
        const { progress } = item;
        setFavorite(progress?.[0]?.is_favorited);
      }
    } else {
      const { progress } = item;
      setFavorite(progress?.[0]?.is_favorite);

      const resp = await courseService.getCourseProgress(id);

      if (resp) {
        const { overall_progress } = resp;
        setIsCompleted(overall_progress === 100);
      }
    }
  }, []);

  async function onHandleFavorite(e) {
    e.preventDefault();
    setFavoriteInProgress(true);
    let favorite = '';
    if (isCourse) {
      favorite = await courseService.putFavoriteCourseById(id);
    } else {
      favorite = await LessonService.PutFavoriteByLessonId({ id });
    }
    setItem && setItem(item);
    setFavoriteInProgress(false);
    if (!setItem) {
      if (favorite) setFavorite((prevState) => !prevState);
    }
  }

  async function onDownload(e) {
    e.preventDefault();

    try {
      const file = await LessonService.PdfLinkByLesson(item.documents);

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
  }

  return (
    <div className="position-relative">
      <AlertWrapper>
        <Alert
          message={errorMessage}
          setMessage={setErrorMessage}
          color="danger"
        />
      </AlertWrapper>
      {isCourse && <CardStack />}

      <Link to={link}>
        <Card className="h-100" style={{ minHeight: 260 }}>
          <div className="card-progress-wrap">
            <div className="progress card-progress">
              <div
                className={`progress-bar ${progressColor}`}
                role="progressbar"
                style={{ width: '100%' }}
                aria-valuenow="100"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
          <CardBody>
            <div className="d-flex flex-column text-block text-hover-green">
              <div className="d-flex flex-row justify-content-between align-items-center mb-4">
                <div>
                  <span
                    className={`material-icons-outlined font-size-4xl font-weight-lighter ${textColor}`}
                  >
                    {categoryInfo?.icon || icon}
                  </span>
                </div>
                {inDraft && (
                  <span className="bg-gray-dark text-white d-inline-block p-1 px-3 ml-auto font-weight-medium rounded-lg fs-9">
                    {DRAFT.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="mb-3">
                <h5 className="card-title font-size-sm text-hover-primary mb-0">
                  {item.title || item.name}
                </h5>
                <span className="card-text text-muted font-size-sm">
                  {category}
                </span>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Row className="justify-content-between align-items-center">
              <Col className="col-auto d-flex flex-row align-items-center">
                {!favoriteInProgress ? (
                  <TooltipComponent
                    title={favorite ? REMOVE_FROM_FAVORITES : ADD_TO_LESSON}
                  >
                    <button
                      className="btn btn-icon btn-icon-sm btn-soft-primary btn-sm rounded-circle cursor-pointer"
                      onClick={(e) => onHandleFavorite(e)}
                    >
                      <MaterialIcon
                        icon={favorite ? 'favorite' : 'favorite_border'}
                      />
                    </button>
                  </TooltipComponent>
                ) : (
                  <Spinner className="mr-1" style={{ width: 26, height: 26 }} />
                )}
                {item.documents && (
                  <TooltipComponent title="Download lessons">
                    <button
                      className="cursor-pointer ml-1 btn btn-icon btn-icon-sm btn-soft-primary btn-sm rounded-circle"
                      onClick={(e) => onDownload(e)}
                    >
                      <MaterialIcon icon="download_for_offline" />
                    </button>
                  </TooltipComponent>
                )}

                {isCompleted && (
                  <TooltipComponent title="100% Completed">
                    <button
                      className="btn btn-icon ml-1 btn-icon-sm btn-soft-success no-hover p-2 btn-sm rounded-circle cursor-default"
                      onClick={(e) => onDownload(e)}
                    >
                      <MaterialIcon
                        filled
                        icon="check_circle"
                        clazz="text-success font-size-xl"
                      />
                    </button>
                  </TooltipComponent>
                )}

                {progress > 0 && !isCompleted && (
                  <>
                    <Progress
                      value={progress}
                      className="ml-2"
                      style={{ minWidth: '8rem', height: '5px' }}
                    />
                    <span className="text-primary font-weight-semi-bold ml-2">
                      {progress}%
                    </span>
                  </>
                )}
              </Col>
              <div className="col-auto text-muted font-size-sm">
                {!isCourse
                  ? item.duration > 0 && `~${item.duration} mins`
                  : `${
                      item?.lessons?.length > 0
                        ? ` ${item?.lessons?.length} lessons `
                        : ''
                    }`}
              </div>
            </Row>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
