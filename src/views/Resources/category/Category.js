import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router';

import Heading from '../../../components/commons/Heading';
import { CategoriesContext } from '../../../contexts/categoriesContext';
import CategorySection from './CategorySection';
import categoryService from '../../../services/category.service';
import {
  COURSES_COMMING_SOON,
  LESSONS_COMMING_SOON,
} from '../../../utils/constants';
import StatsAndFilter, {
  FILTER_OPTIONS_LIST,
} from '../../../components/lesson/StatsAndFilter';
import LoadMoreButton from '../../../components/lesson/LoadMoreButton';
import { sortByCompleted, TrainingViewTypes } from '../../../utils/Utils';
import NoDataFound from '../../../components/commons/NoDataFound';

export default function Category() {
  const limit = 9;
  const { pathname } = useLocation();
  const { slug } = useParams();
  const [title, setTitle] = useState('');
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonPage, setLessonPage] = useState(1);
  const [lessonPagination, setLessonPagination] = useState({ page: 1, limit });
  const [refreshView, setRefreshView] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursePage, setCoursePage] = useState(1);
  const [coursePagination, setCoursePagination] = useState({ page: 1, limit });
  const [overview, setOverview] = useState({});
  const { categoryList } = useContext(CategoriesContext);
  const [filterOptionSelected, setFilterOptionSelected] = useState(
    FILTER_OPTIONS_LIST[0]
  );

  const getFiltersRequestByOptionStringify = (option, type) => {
    const { key } = option;

    const query = {};

    switch (key) {
      case 'latest':
        if (
          type === TrainingViewTypes.Course ||
          type === TrainingViewTypes.Lesson
        ) {
          query.order = [
            ['progress.completed_at', 'asc nulls first'],
            ['progress.last_attempted_at', 'desc nulls last'],
            ['updated_at', 'desc'],
          ];
        }
        break;
      case 'asc':
      case 'desc':
        if (type === TrainingViewTypes.Course) {
          query.order = [['name', key]];
        } else if (type === TrainingViewTypes.Lesson) {
          query.order = [['title', key]];
        }
        break;
      case 'favs':
        query.favorites = true;
    }

    return query;
  };

  const getFiltersRequestByOption = (option, type) => {
    const { key } = option;

    const query = {};

    switch (key) {
      case 'favs':
        query.favorites = true;
        break;
      case 'latest':
        query.order = [
          ['progress.completed_at', 'asc nulls first'],
          ['progress.last_attempted_at', 'desc nulls last'],
          ['updated_at', 'desc'],
        ];
        break;
      case 'asc':
      case 'desc':
        if (type === TrainingViewTypes.Course) {
          query.order = [['name', key]];
        } else if (type === TrainingViewTypes.Lesson) {
          query.order = [['title', key]];
        }
        break;
    }

    return query;
  };

  const getCategoryInfoByPath = () => {
    return categoryList?.find((category) => category.path === pathname);
  };

  const getSummary = async (categoryInfo) => {
    const filter = getFiltersRequestByOption(filterOptionSelected);

    // TODO fix filter...
    const resp = await categoryService.GetCategoryById(categoryInfo.id, filter);

    setOverview(resp);
  };

  const getLessons = async (categoryInfo) => {
    const filter = getFiltersRequestByOptionStringify(
      filterOptionSelected,
      TrainingViewTypes.Lesson
    );

    if (categoryInfo) {
      const { id, title } = categoryInfo;

      const resp = await categoryService
        .GetLessonsByCategory({
          ...filter,
          id,
          page: lessonPage,
          limit,
          self: true,
          progress: true,
        })
        .catch((err) => console.log(err));

      const previousList =
        refreshView > 0 || !lessonsLoading ? [] : [...lessons];
      const newLessons = [...previousList, ...resp?.data];

      setLoading(false);
      setLessons(newLessons);
      setTitle(title);
      setLessonsLoading(false);
      setLessonPagination(resp?.pagination);
    }
  };

  const getCourses = async (categoryInfo) => {
    const filter = getFiltersRequestByOption(
      filterOptionSelected,
      TrainingViewTypes.Course
    );

    if (categoryInfo) {
      const { id } = categoryInfo;

      const resp = await categoryService
        .getCoursesByCategory(id, {
          ...filter,
          page: coursePage,
          limit,
          self: true,
          progress: true,
        })
        .catch((err) => console.log(err));

      const previousList =
        refreshView > 0 || !coursesLoading ? [] : [...courses];
      setCourses(
        sortByCompleted([...previousList, ...resp?.data], 'courseTracking')
      );
      setCoursesLoading(false);
      setCoursePagination(resp?.pagination);
    }
  };

  function getCoursesLessonsByCategory() {
    setLoading(true);
    const categoryInfo = getCategoryInfoByPath();
    if (categoryInfo) {
      setCurrentCategory(categoryInfo);
      getLessons(categoryInfo);
      getCourses(categoryInfo);
      getSummary(categoryInfo);
    }
  }

  useEffect(() => {
    if (refreshView > 0) {
      setLoading(true);
      setLessons([]);
      setCourses([]);
      setLessonPage(1);
      setCoursePage(1);
    }
  }, [refreshView]);

  useEffect(() => {
    if (categoryList.length) {
      getCoursesLessonsByCategory();
    }
    setLoading(true);
    setRefreshView((prevState) => prevState + 1);
  }, [pathname, categoryList]);

  useEffect(() => {
    getLessons(getCategoryInfoByPath());
  }, [lessonPage]);

  useEffect(() => {
    getCourses(getCategoryInfoByPath());
  }, [coursePage]);

  const handleFilterSelect = (e, option) => {
    e.preventDefault();
    setFilterOptionSelected(option);
    setRefreshView((prevState) => prevState + 1);
  };

  const onCoursesLoadMore = () => {
    setCoursesLoading(true);
    setRefreshView(0);
    setCoursePage((prevState) => prevState + 1);
  };

  const onLessonsLoadMore = () => {
    setLessonsLoading(true);
    setRefreshView(0);
    setLessonPage((prevState) => prevState + 1);
  };

  useEffect(() => {
    getCoursesLessonsByCategory();
  }, [filterOptionSelected]);

  return (
    <div className="pipeline-header">
      <Heading title={title} showGreeting useBc paddingBottomDefault>
        <StatsAndFilter
          handleFilterSelect={handleFilterSelect}
          filterOptionSelected={filterOptionSelected}
          stats={overview}
          loading={loading}
          lessonKey="totalLessons"
          courseKey="totalCourses"
          type="Categories"
          categoryInfo={currentCategory}
        />
      </Heading>
      <div className="mt-5">
        <CategorySection
          slug={slug}
          data={courses}
          loading={loading}
          commingSoonText={COURSES_COMMING_SOON}
          title="Courses"
          sectionType="course"
        />
        <LoadMoreButton
          list={courses}
          pagination={coursePagination}
          loading={coursesLoading}
          onClick={onCoursesLoadMore}
        />
        {loading && <br />}
        <CategorySection
          slug={slug}
          data={lessons}
          loading={loading}
          commingSoonText={LESSONS_COMMING_SOON}
          title="Lessons"
        />
        <LoadMoreButton
          list={lessons}
          pagination={lessonPagination}
          loading={lessonsLoading}
          onClick={onLessonsLoadMore}
        />
      </div>

      {filterOptionSelected.key === 'favs' &&
      !loading &&
      !lessons.length &&
      !courses.length ? (
        <NoDataFound
          title="No favorite here."
          icon="school"
          containerStyle="text-gray-900 my-6 py-6"
        ></NoDataFound>
      ) : (
        <div>
          {!loading && !lessons.length && !courses.length && (
            <NoDataFound
              title="No trainings yet."
              description="Courses and lessons are coming soon."
              icon="school"
              containerStyle="text-gray-900 my-6 py-6"
            ></NoDataFound>
          )}
        </div>
      )}
    </div>
  );
}
