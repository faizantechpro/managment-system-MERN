import React, { useContext, useEffect, useState } from 'react';
import { Card, FormGroup, ListGroup } from 'react-bootstrap';
import { Label } from 'reactstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import DropdownSearch from '../../../components/DropdownSearch';
import DropdownLesson from '../../../components/lesson/DropdownLesson';
import categoryService from '../../../services/category.service';
import courseService from '../../../services/course.service';
import lessonService from '../../../services/lesson.service';
import { courseInit } from './courses.constants';
import stringConstants from '../../../utils/stringConstants.json';
import HeaderCardCourses from '../../../components/courses/HeaderCardCourse';
import FormCourses from '../../../components/courses/FormCourses';
import {
  CATEGORY_REQUIRED,
  DRAFT,
  PUBLISHED,
  SEARCH_FOR_CATEGORY,
  SERVER_ERROR,
} from '../../../utils/constants';
import AlertWrapper from '../../../components/Alert/AlertWrapper';
import Alert from '../../../components/Alert/Alert';
import { Controller, useForm } from 'react-hook-form';
import ValidationErrorText from '../../../components/commons/ValidationErrorText';
import Asterick from '../../../components/commons/Asterick';
import NoDataFound from '../../../components/commons/NoDataFound';
import { CategoriesContext } from '../../../contexts/categoriesContext';
import MaterialIcon from '../../../components/commons/MaterialIcon';
import TooltipComponent from '../../../components/lesson/Tooltip';

const constants = stringConstants.settings.resources.courses;
const ItemLesson = ({ lesson, index, deleteItem }) => {
  return (
    <Draggable key={lesson.id} draggableId={`id-${lesson.id}`} index={index}>
      {(provided) => (
        <ListGroup.Item
          className="border-0 p-0"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="d-flex bg-hover-gray-dark rounded align-items-center py-2 pr-1 justify-content-between">
            <div id={lesson.id} className="item-user d-flex align-items-center">
              <div {...provided.dragHandleProps}>
                <MaterialIcon icon="drag_indicator" clazz="icon-list-size" />
              </div>
              <h5 className="mb-0 d-flex align-items-center ml-1">
                <span className="mr-1">{index + 1}.</span>
                <span>{lesson.title}</span>
              </h5>
            </div>
            <div>
              <TooltipComponent title="Delete">
                <a
                  className="cursor-pointer"
                  onClick={() => {
                    deleteItem(index);
                  }}
                >
                  <MaterialIcon icon="delete" clazz="text-danger" />
                </a>
              </TooltipComponent>
            </div>
          </div>
        </ListGroup.Item>
      )}
    </Draggable>
  );
};

const ListLesson = ({ lessons, deleteItem, onDragEnd }) => {
  const Title = () => {
    return <div className="text-muted">No Lessons</div>;
  };
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <ListGroup
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="mt-3"
              variant="flush"
            >
              {lessons.map((lesson, index) => (
                <ItemLesson
                  key={index}
                  lesson={lesson}
                  index={index}
                  deleteItem={deleteItem}
                />
              ))}
              {provided.placeholder}
            </ListGroup>
          )}
        </Droppable>
      </DragDropContext>
      {lessons.length === 0 && (
        <NoDataFound
          title={<Title />}
          icon="menu_book"
          containerStyle="w-100 border bg-gray-200 rounded border-dashed-gray height-300 text-muted"
        />
      )}
    </>
  );
};

const CategoryDropdown = ({
  title,
  categories,
  onHandleSelect,
  onHandleChange,
  errorClass,
  loading,
}) => {
  return (
    <FormGroup>
      <Label htmlFor="category">
        {constants.selectCategory} <Asterick />{' '}
      </Label>
      <DropdownSearch
        id="category"
        title={title}
        name="SELECT_CATEGORY"
        onChange={onHandleChange}
        data={categories}
        errorClass={errorClass}
        showAvatar={false}
        onHandleSelect={onHandleSelect}
        loading={loading}
        placeholder={SEARCH_FOR_CATEGORY}
        customTitle="title"
      />
    </FormGroup>
  );
};

const ManagementCourses = ({ currentCourseId, setCreate }) => {
  const [currentCourse, setCurrentCourse] = useState(courseInit);
  const [allCategories, setAllCategories] = useState([]);
  const [allLessons, setAllLessons] = useState([]);
  const [selectLessons, setSelectLessons] = useState([]);
  const [removedLessons, setRemovedLessons] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const { setRefresh } = useContext(CategoriesContext);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const onHandleChangeForm = (e) => {
    const { name } = e.target;
    let value = e.target.value;

    if (name === 'name') {
      setValue('name', value);
    }

    if (name === 'is_learning_path') {
      value = !currentCourse.is_learning_path;
    }

    setCurrentCourse({
      ...currentCourse,
      [name]: value,
    });
  };

  const getCategories = async ({ search, limit = 1000 }) => {
    const options = { search, order: ['updated_at', 'DESC'] };
    try {
      const response = await categoryService.GetCategories(options, { limit });
      const { data } = response;
      setAllCategories(data);
      setLoadingCategories(false);
    } catch (e) {
      setErrorMessage(SERVER_ERROR);
    }
  };

  const getLessons = async ({ search }) => {
    try {
      if (!currentCourse.category?.id) return;

      const data = await lessonService.GetLessonsByCatId(
        currentCourse.category.id,
        search,
        1,
        100
      );

      setAllLessons(data?.data);
    } catch (e) {
      setErrorMessage(SERVER_ERROR);
    }
  };

  const onHandleDeleteLesson = (index) => {
    const lessons = selectLessons?.slice();
    const [removed] = lessons.splice(index, 1);

    setSelectLessons(lessons);

    if (currentCourse.id) {
      const removedId = [...removedLessons];
      if (removed.CourseLessonModel)
        removedId.push(removed.CourseLessonModel.id);

      setRemovedLessons(removedId);
    }
  };

  const createCourse = async (status = 'draft') => {
    const lessons = selectLessons.map((item) => item.id);
    const { name, is_learning_path, category } = currentCourse;
    const newCourse = {
      name,
      description: currentCourse.description || '',
      is_learning_path,
      lessons,
      status,
      category_id: category?.id || '',
    };

    setLoading(true);

    try {
      const { id } = await courseService.saveCourseLessons(newCourse);
      setSuccessMessage(constants.courseCreateSuccessMessage);
      setCurrentCourse({ ...currentCourse, id });
      reset({});
      // this is updating a categories context so that when any category is updated
      // we also trigger an update to refresh call from api for sidemenu navigation
      setRefresh((prevState) => prevState + 1);
      setCreate(false);
    } catch (e) {
      setErrorMessage(SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async () => {
    const lessons = selectLessons.map((item) => item.id);
    const { id, name, is_learning_path, category } = currentCourse;
    const courseUpdate = {
      name,
      description: currentCourse.description || '',
      is_learning_path,
      lessons,
      removedLessons,
      category_id: category?.id,
      status: DRAFT,
    };

    setLoading(true);

    try {
      await courseService.updateCourseLessons(id, courseUpdate);
      setSuccessMessage(constants.courseUpdateSuccessMessage);
      reset({});
      // this is updating a categories context so that when any category is updated
      // we also trigger an update to refresh call from api for sidemenu navigation
      setRefresh((prevState) => prevState + 1);
      setCreate(false);
    } catch (e) {
      setErrorMessage(SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const onHandleSaveCourse = async () => {
    const lessons = selectLessons;

    if (!lessons || lessons.length < 2) {
      setErrorMessage('Minimum 2 lessons are required');
      return;
    }

    if (currentCourse.id) {
      updateCourse();
    } else {
      createCourse();
    }
  };

  const onHandlePublished = async () => {
    const lessons = selectLessons;

    if (!lessons || lessons.length < 2) {
      setErrorMessage('Minimum 2 lessons are required');
      return;
    }

    setLoadingPublish(true);
    const lessonIds = selectLessons.map((item) => item.id);
    const status = PUBLISHED;
    const { id, name, is_learning_path, category } = currentCourse;
    const courseUpdate = {
      name,
      description: currentCourse.description || '',
      is_learning_path,
      lessons: lessonIds,
      removedLessons,
      category_id: category?.id,
      status,
    };
    console.log('course create' + JSON.stringify(courseUpdate));
    await courseService.updateCourseLessons(id, courseUpdate);

    courseService
      .updateCourse(currentCourse.id, { status })
      .then(() => {
        currentCourse.status = PUBLISHED;
        setSuccessMessage(
          currentCourse.status === PUBLISHED
            ? constants.coursePublishedSuccessMessage
            : constants.courseUnpublishedSuccessMessage
        );
        setCreate(false);
      })
      .catch((e) => {
        setErrorMessage(SERVER_ERROR);
      })
      .finally(() => {
        setLoadingPublish(false);
      });
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onHandleDragEndLessons = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      selectLessons,
      result.source.index,
      result.destination.index
    );

    setSelectLessons(items);
  };

  const clearLessons = () => {
    if (currentCourse.id) {
      const removedId = [];
      selectLessons.forEach((lesson) => {
        if (lesson.CourseLessonModel) {
          removedId.push(lesson.CourseLessonModel.id);
        }
      });

      setRemovedLessons([...removedLessons, ...removedId]);
    }
  };

  useEffect(() => {
    const getData = async () => {
      await getCategories({});
    };

    getData();
  }, []);

  useEffect(() => {
    clearLessons();
    setSelectLessons([]);
    setCurrentCourse({
      ...currentCourse,
      category: {},
    });
  }, [currentCourse.is_learning_path]);

  useEffect(() => {
    const getData = async () => {
      await getLessons({});
    };
    getData();
  }, [currentCourse.category?.id]);

  useEffect(() => {
    const getDataCourse = async () => {
      if (currentCourseId && currentCourseId !== 'new') {
        await courseService
          .getCourseLessonsById(currentCourseId)
          .then((course) => {
            if (course) {
              const {
                id,
                name,
                description,
                is_learning_path,
                badge,
                quiz,
                status,
                lessons,
                category,
              } = course;

              setCurrentCourse({
                id,
                name,
                description,
                is_learning_path,
                status,
                badge,
                quiz,
                category,
              });

              setValue('name', name);
              setValue('categoryId', category?.id);

              const lessonsOrder = lessons.sort((next, prox) => {
                if (
                  next.CourseLessonModel.position >
                  prox.CourseLessonModel.position
                ) {
                  return 1;
                }
                return -1;
              });

              setSelectLessons(lessonsOrder);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    };

    getDataCourse();
  }, [currentCourseId]);

  return (
    <div>
      <AlertWrapper>
        <Alert
          color="success"
          message={successMessage}
          setMessage={setSuccessMessage}
        />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      <Card>
        <form onSubmit={handleSubmit(onHandleSaveCourse)}>
          <HeaderCardCourses
            published={currentCourse.status?.toLowerCase() !== 'published'}
            loading={loading}
            loadingPublish={loadingPublish}
            onHandleSave={onHandleSaveCourse}
            onHandlePublished={onHandlePublished}
            flagNew={currentCourse.id}
            goBack={setCreate}
            register={register}
            errors={errors}
            courseForm={currentCourse}
            onHandleChange={onHandleChangeForm}
            courseId={currentCourseId}
          />
          <Card.Body className="px-3">
            <div className="d-flex">
              <div className="w-100">
                <div>
                  <Controller
                    render={({ field }) => (
                      <FormGroup>
                        <CategoryDropdown
                          {...field}
                          categories={allCategories}
                          loading={loadingCategories}
                          errorClass={`${
                            errors.categoryId && !currentCourse.category?.id
                              ? 'border-danger border'
                              : ''
                          }`}
                          onHandleChange={(e) => {
                            if (e) {
                              const { value } = e.target;
                              setLoadingCategories(true);
                              getCategories({ search: value });
                            }
                          }}
                          title={
                            currentCourse.category?.title ||
                            constants.selectCategory
                          }
                          onHandleSelect={(item) => {
                            setValue('categoryId', item.id);
                            setCurrentCourse({
                              ...currentCourse,
                              category: item,
                            });
                            clearLessons();
                            setSelectLessons([]);
                          }}
                        />
                      </FormGroup>
                    )}
                    name="categoryId"
                    rules={{ required: true }}
                    control={control}
                  />
                  {errors.categoryId && !currentCourse.category?.title && (
                    <ValidationErrorText text={CATEGORY_REQUIRED} />
                  )}
                </div>

                {currentCourse.category?.id && (
                  <div className="pt-0">
                    <FormGroup>
                      <Label
                        htmlFor="selectLessonDropdown"
                        className="form-label"
                      >
                        {constants.searchLessonPlaceholder} <Asterick />{' '}
                        <span className="fs-8 font-weight-normal">
                          (minimum 2 are required)
                        </span>
                      </Label>
                      <DropdownLesson
                        id={`selectLessonDropdown`}
                        title={constants.searchLessonPlaceholder}
                        placeholder={constants.searchLessonPlaceholder}
                        value={''}
                        results={allLessons}
                        error={'nada'}
                        selection={selectLessons}
                        setSelection={setSelectLessons}
                        onDeleteLesson={onHandleDeleteLesson}
                        onChange={(e) => {
                          if (e) {
                            const { value } = e.target;
                            getLessons({ search: value });
                          }
                        }}
                      />
                    </FormGroup>
                    <ListLesson
                      lessons={selectLessons}
                      deleteItem={onHandleDeleteLesson}
                      onDragEnd={onHandleDragEndLessons}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card.Body>
          <Card.Footer className="px-3">
            <FormCourses
              course={currentCourse}
              errors={errors}
              register={register}
              setValue={setValue}
              onHandleChange={onHandleChangeForm}
            />
          </Card.Footer>
        </form>
      </Card>
    </div>
  );
};

export default ManagementCourses;
