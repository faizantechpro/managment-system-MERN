import React, { useState, useEffect, useContext } from 'react';
import { Row, Col } from 'reactstrap';

import Heading from '../../components/commons/Heading';
import Card from '../../components/lesson/card';
import SubHeading from '../../components/subheading';
import { API } from '../../services/api';
import { categoriesDefaultInfo } from '../../views/Resources/category/constants/Category.constants';
import { CategoriesContext } from '../../contexts/categoriesContext';
import CategorySection from './category/CategorySection';
import courseService from '../../services/course.service';
import LoadMoreButton from '../../components/lesson/LoadMoreButton';
import StatsAndFilter, {
  FILTER_OPTIONS_LIST,
} from '../../components/lesson/StatsAndFilter';
import CardSkeleton from '../../components/lesson/CardSkeleton';
import { sortByCompleted, TrainingViewTypes } from '../../utils/Utils';
import NoDataFound from '../../components/commons/NoDataFound';

function LessonCard(props) {
  const { lesson, setLesson } = props;
  const [icon, setIcon] = useState('');
  const { categoryList } = useContext(CategoriesContext);

  useEffect(() => {
    const { category_id } = lesson;

    const categoryInfo = categoryList?.find(
      (category) => category.id === category_id
    );

    if (categoryInfo) {
      const slug = categoryInfo.title
        .toLocaleLowerCase()
        .trim()
        .replace(/ /g, '-');

      const icon = categoriesDefaultInfo[slug]?.icon || 'summarize';
      setIcon(icon);
    }
  }, []);

  return <Card item={lesson} setItem={setLesson} icon={icon} />;
}

function MyLessonsSection({ lessons, setLessons, title, loading }) {
  if (loading)
    return (
      <div className="my-5">
        {' '}
        <SubHeading title={title} /> <CardSkeleton count={3} />{' '}
      </div>
    );

  return (
    <>
      {lessons?.length > 0 && (
        <>
          <SubHeading title={title} />
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3">
            {lessons.map((lesson, indx) => (
              <Col key={indx} className="mb-5">
                <LessonCard lesson={lesson} setLesson={setLessons} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
}

export default function MyLessons() {
  const api = new API();
  const limit = 9; // default items count for this page
  const [overview, setOverview] = useState({});
  const [favorited, setFavorited] = useState([]);
  const [favoriteLessonsPagination, setFavoriteLessonsPagination] = useState(
    {}
  );
  const [favoriteLessonPage, setFavoriteLessonPage] = useState(1);
  const [favouriteLessonsLoading, setFavoriteLessonsLoading] = useState(false);
  const [filterOptionSelected, setFilterOptionSelected] = useState(
    FILTER_OPTIONS_LIST[0]
  );
  const [courses, setCourses] = useState([]);
  const [favoriteCoursesPagination, setFavoriteCoursesPagination] = useState(
    {}
  );
  const [favoriteCoursePage, setFavoriteCoursePage] = useState(1);
  const [favouriteCoursesLoading, setFavoriteCoursesLoading] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const getFiltersRequestByOption = (option, type) => {
    const { key } = option;
    switch (key) {
      case 'latest':
        if (
          type === TrainingViewTypes.Course ||
          type === TrainingViewTypes.Lesson
        ) {
          return {
            order: [['updated_at', 'desc']],
          };
        }
        return;
      case 'asc':
      case 'desc':
        if (type === TrainingViewTypes.Course) {
          return {
            order: [['name', key]],
          };
        } else if (type === TrainingViewTypes.Lesson) {
          return {
            order: [['title', key]],
          };
        }
    }
  };

  async function getFavouriteCourses(isRefresh) {
    const filter = getFiltersRequestByOption(
      filterOptionSelected,
      TrainingViewTypes.Course
    );

    const resp = await courseService.getCourses({
      page: favoriteCoursePage,
      limit,
      self: true,
      favorites: true,
      ...filter,
    });

    const newCourses = isRefresh
      ? [...resp?.data]
      : [...courses, ...resp?.data];
    setCourses(sortByCompleted(newCourses, 'courseTracking'));
    setFavoriteCoursesPagination(resp?.pagination);
    setFavoriteCoursesLoading(false);
    setLoadingCourses(false);
  }

  function getLessonsByStatus(isRefresh) {
    const filter = getFiltersRequestByOption(
      filterOptionSelected,
      TrainingViewTypes.Lesson
    );
    api
      .GetLessons({
        page: favoriteLessonPage,
        limit,
        self: true,
        favorites: true,
        ...filter,
      })
      .then((response) => {
        const newLessons = isRefresh
          ? [...response.data]
          : [...favorited, ...response.data];
        setFavoriteLessonsPagination(response.pagination);
        setFavorited(sortByCompleted(newLessons, 'progress'));
        setFavoriteLessonsLoading(false);
        setLoadingLessons(false);
      });
  }

  const getSummary = () => {
    const filter = {
      self: true,
      favorites: true,
    };
    api.GetTotalPoints(filter).then((result) => {
      setOverview(result || {});
      setLoadingSummary(false);
    });
  };

  useEffect(async () => {
    setLoadingSummary(true);
    setLoadingLessons(true);
    setLoadingCourses(true);
    getSummary();
  }, []);

  useEffect(() => {
    getLessonsByStatus();
  }, [favoriteLessonPage]);

  useEffect(() => {
    getFavouriteCourses();
  }, [favoriteCoursePage]);

  const handleFilterSelect = (e, option) => {
    e.preventDefault();
    setLoadingLessons(true);
    setLoadingCourses(true);
    setLoadingSummary(true);
    setCourses([]);
    setFavorited([]);
    setFilterOptionSelected(option);
  };

  const onLessonsLoadMore = () => {
    setFavoriteLessonsLoading(true);
    setFavoriteLessonPage((prevState) => prevState + 1);
  };

  const onCoursesLoadMore = () => {
    setFavoriteCoursesLoading(true);
    setFavoriteCoursePage((prevState) => prevState + 1);
  };

  // will use this function to remove favorites from list so that we don't have to call api
  // after page refresh or page reopened it is going to fetch fresh from API
  const handleLessonsUpdate = () => {
    setLoadingLessons(true);
    setLoadingSummary(true);
    getLessonsByStatus(true);
    getSummary();
  };

  const handleCoursesUpdate = () => {
    setLoadingCourses(true);
    setLoadingSummary(true);
    getFavouriteCourses(true);
    getSummary();
  };

  useEffect(() => {
    getLessonsByStatus();
    getFavouriteCourses();
    getSummary();
  }, [filterOptionSelected]);

  return (
    <>
      <div className="pipeline-header">
        <Heading title="My Favorites" showGreeting useBc paddingBottomDefault>
          <StatsAndFilter
            handleFilterSelect={handleFilterSelect}
            filterOptionSelected={filterOptionSelected}
            loading={loadingSummary}
            stats={overview}
            lessonKey="total_lessons"
            courseKey="total_courses"
            type="Favorites"
          />
        </Heading>

        <div className="mt-5">
          <CategorySection
            slug={'ach'}
            data={courses}
            setData={handleCoursesUpdate}
            loading={loadingCourses}
            commingSoonText="No favorite courses"
            title="Courses"
            sectionType="course"
          />
          <LoadMoreButton
            list={courses}
            pagination={favoriteCoursesPagination}
            loading={favouriteCoursesLoading}
            onClick={onCoursesLoadMore}
          />
        </div>

        <div>
          <MyLessonsSection
            lessons={favorited}
            setLessons={handleLessonsUpdate}
            loading={loadingLessons}
            title={'Lessons'}
          />
        </div>

        <LoadMoreButton
          list={favorited}
          pagination={favoriteLessonsPagination}
          loading={favouriteLessonsLoading}
          onClick={onLessonsLoadMore}
        />

        {!loadingCourses &&
          !loadingLessons &&
          !loadingSummary &&
          !favorited.length &&
          !courses.length && (
            <NoDataFound
              title="No Favorites yet."
              description="To get started, explore available training from the left navigation."
              icon="favorite_outline"
              containerStyle="text-gray-900 my-6 py-6"
            ></NoDataFound>
          )}
      </div>
    </>
  );
}
