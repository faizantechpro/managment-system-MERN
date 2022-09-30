import { useContext, useEffect, useReducer, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import LessonAdminHeader from '../../components/manageLessons/LessonAdminHeader';
import LessonForm from '../../components/manageLessons/LessonForm';
import lessonService from '../../services/lesson.service';
import userService from '../../services/user.service';
import {
  BAD_UPLOAD_VIDEO,
  DRAFT,
  initialLessonState,
  LESSON_CREATED,
  LESSON_CREATE_REQUIRED,
  LESSON_UPDATED,
  OPTIONS_ANSWER,
  OPTIONS_LENGTH_ERROR,
  OPTIONS_WITHOUT_DESCRIPTION,
  PAGE_CREATE_REQUIRED,
  PDF_UPLOAD_ERROR,
  PUBLISHED,
  QUIZ,
  QUIZ_REVIEW,
  VIDEO,
  WISTIA_UPLOAD_VIDEO,
} from '../../utils/constants';
import { createBlobObject } from '../../utils/Utils';
import { API } from '../../services/api';
import AlertWrapper from '../../components/Alert/AlertWrapper';
import Alert from '../../components/Alert/Alert';
import { useForm } from 'react-hook-form';
import { CategoriesContext } from '../../contexts/categoriesContext';

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
      return initialLessonState;
    default:
      return state;
  }
}

const LessonAdminView = ({ lessonId, setLessonId, setCreate }) => {
  const api = new API();

  const [pdf, setPdf] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lessonSuccess, setLessonSuccess] = useState('');
  const [pages, setPages] = useState([]);
  const [isPublish, setIsPublish] = useState(DRAFT);
  const [removeIds, setRemoveIds] = useState([]);
  const [lessonForm, dispatch] = useReducer(reducer, initialLessonState);
  const { setRefresh } = useContext(CategoriesContext);

  const videoRegex =
    /https?:\/\/(.+)?(identifee.wistia\.com|wi\.st)\/(medias)\//;

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

  useEffect(() => {
    const getLessonAdmin = async () => {
      const lesson = await api
        .GetLessonById(lessonId)
        .catch((err) => console.log(err));

      const {
        id,
        title,
        content,
        category: { id: categoryId },
        max_points: maxPoints,
        max_attempts: maxAttemps,
        duration,
        tags,
        documents,
        pages,
        status,
      } = lesson || {};

      // hook form setting value of lesson name, categoryId here
      setValue('title', title);
      setValue('categoryId', categoryId);
      const parsedTags = tags.length && JSON.parse(tags);
      setValue('tagHidden', parsedTags?.length ? tags : '');

      const newPages = pages.slice();

      const severalQuestions = newPages?.filter((page) => page.type === QUIZ);

      if (severalQuestions.length > 0) {
        severalQuestions.forEach((question) => {
          const quizTypeIndex = newPages.findIndex(
            (page) => page.id === question.id
          );

          if (quizTypeIndex !== -1)
            newPages[quizTypeIndex].content =
              newPages[quizTypeIndex + 1]?.content;
        });
      }

      setPages(newPages);

      const pdf = documents && (await getPdf(documents));

      if (pdf)
        setPdf({
          name: pdf.filename_download,
          size: pdf.filesize,
        });

      setIsPublish(status);

      dispatch({
        type: 'edit',
        payload: {
          id,
          title,
          content,
          categoryId,
          maxPoints,
          maxAttemps,
          duration,
          tags: JSON.parse(tags),
          documents,
          status,
        },
      });
    };

    if (lessonId) getLessonAdmin();
  }, [lessonId, isPublish]);

  const onAddPage = ({ type, placeholder }) => {
    const newPages = pages.slice();

    const defaultPageObject = {
      id: uuidv4(),
      title: null,
      lesson_id: lessonId || null,
      content: null,
      type,
      qtype: null,
      qoption: [],
      order: pages.length + 1,
      placeholder,
      isNew: true, // just for expand newly created item, rest needs to be collapsed
    };

    newPages.push(defaultPageObject);

    if (type === QUIZ)
      newPages.push({
        ...defaultPageObject,
        id: uuidv4(),
        title: 'QUIZ_REVIEW',
        type: QUIZ_REVIEW,
        order: pages.length + 2,
      });

    setPages(newPages);
  };

  const getPdf = async (documentId) => {
    const response = await userService.getFile(documentId);

    return response?.data;
  };

  const onUploadPdf = async () => {
    const form = new FormData();

    form.append('file', await createBlobObject(pdf), pdf.name);

    const {
      data: {
        data: { id },
      },
    } = await userService.uploadAvatar(form);

    return id;
  };

  const createLessonPages = (id) => {
    const newPages = pages.map((page, index) => {
      if (page.type !== VIDEO && page.type !== QUIZ_REVIEW && !page.title) {
        return setErrorMessage(PAGE_CREATE_REQUIRED);
      }

      delete page.id;

      if (page.type === QUIZ) {
        return {
          ...page,
          lesson_id: id,
          content: '',
          qtype: 'mc',
        };
      }

      if (page.type === QUIZ_REVIEW) {
        const title = pages[index - 1].title;
        const content = pages[index - 1].content;

        return {
          ...page,
          lesson_id: id,
          title,
          content,
        };
      }

      if (page.type === VIDEO) {
        if (!videoRegex.test(page.content))
          return setErrorMessage(BAD_UPLOAD_VIDEO);

        return {
          ...page,
          lesson_id: id,
        };
      }

      return {
        ...page,
        lesson_id: id,
      };
    });

    return lessonService
      .createUpdatePages(id, newPages.filter(Boolean))
      .catch((err) => console.log(err));
  };

  const updateLessonPages = () => {
    const newPages = pages?.map((page, index) => {
      if (page.type === QUIZ) {
        return {
          ...page,
          lesson_id: lessonId,
          content: '',
          qtype: 'mc',
        };
      }

      if (page.type === QUIZ_REVIEW) {
        const title = pages[index - 1].title;
        const content = pages[index - 1].content;

        return {
          ...page,
          lesson_id: lessonId,
          title,
          content,
        };
      }

      if (page.type === VIDEO && !videoRegex.test(page.content)) {
        const index = pages.findIndex((pageFound) => pageFound.id === page.id);

        pages.splice(index, 1);
      }

      return page;
    });

    return lessonService
      .createUpdatePages(lessonId, newPages, removeIds)
      .catch((err) => console.log(err));
  };

  const setAndUploadPdf = async () => {
    lessonForm.documents = null;

    if (pdf) {
      const pdfId = await onUploadPdf().catch((err) => console.log(err));

      if (!pdfId) {
        setIsLoading(false);
        setPdf(null);
        return setErrorMessage(PDF_UPLOAD_ERROR);
      }

      lessonForm.documents = pdfId;
    }
  };

  const onHandlePublish = async () => {
    delete lessonForm.tagHidden;

    setLoadingPublish(true);

    await setAndUploadPdf();

    await lessonService
      .createUpdateLesson({
        ...lessonForm,
        tags: JSON.stringify(lessonForm.tags),
        status: PUBLISHED,
      })
      .catch((err) => setErrorMessage(err));

    await updateLessonPages();

    setIsPublish(PUBLISHED);

    setLessonSuccess(PUBLISHED);
    setLoadingPublish(false);
    setCreate(false);
  };

  // if all videos of pages have valid url/content
  const isVideoValidated = (videos) => {
    return videos.every((video) => {
      return video.content && videoRegex.test(video.content);
    });
  };

  // if all slide pages have valid title
  const isTextValidated = (texts) => {
    return texts.every((text) => {
      return !!text.title;
    });
  };

  const onSubmit = async () => {
    delete lessonForm.tagHidden;

    if (!lessonId) {
      delete lessonForm.id;
    }

    if (!lessonForm.title || !lessonForm.categoryId)
      return setErrorMessage(LESSON_CREATE_REQUIRED);

    if (!pages.length) {
      return setErrorMessage('At least 1 Text or Video is required.');
    }

    const quizExist = pages?.filter((page) => page.type === QUIZ);
    const videoExist = pages?.filter((page) => page.type === VIDEO);
    const textExist = pages?.filter(
      (page) => page.type !== VIDEO && page.type !== QUIZ
    );

    let optionsOutRange = false;
    let optionsWithoutAnswer = false;
    let optionsWithoutDescription = false;

    quizExist?.forEach((quiz) => {
      if (
        (quiz?.title && quiz?.qoption.length < 2) ||
        quiz?.qoption.length > 5
      ) {
        optionsOutRange = true;
      }

      quiz?.qoption?.map((option) => {
        if (!option.answer) optionsWithoutDescription = true;

        return optionsWithoutDescription;
      });

      const optionCorrectExist = quiz?.qoption?.filter((opt) => opt.correct);

      if (quiz?.title && !optionCorrectExist?.length) {
        optionsWithoutAnswer = true;
      }
    });

    if (quizExist?.length && optionsOutRange) {
      return setErrorMessage(OPTIONS_LENGTH_ERROR);
    }

    if (quizExist?.length && optionsWithoutAnswer) {
      return setErrorMessage(OPTIONS_ANSWER);
    }

    if (quizExist?.length && optionsWithoutDescription) {
      return setErrorMessage(OPTIONS_WITHOUT_DESCRIPTION);
    }

    if (videoExist?.length && !isVideoValidated(videoExist)) {
      return setErrorMessage(WISTIA_UPLOAD_VIDEO);
    }

    if (textExist?.length && !isTextValidated(textExist)) {
      return setErrorMessage(PAGE_CREATE_REQUIRED);
    }

    setIsLoading(true);

    await setAndUploadPdf();

    const resp = await lessonService
      .createUpdateLesson({
        ...lessonForm,
        tags: JSON.stringify(lessonForm.tags),
        status: DRAFT,
      })
      .catch((err) => setErrorMessage(err));

    if (lessonId) {
      await updateLessonPages();
      setLessonSuccess(LESSON_UPDATED);
    }

    if (!lessonId) {
      const {
        data: { id },
        status,
      } = resp || {};

      if (status === 200) {
        if (pages.length) {
          await createLessonPages(id);
        }
        setLessonSuccess(LESSON_CREATED);
        setLessonId(id);
      }
    }

    setRemoveIds([]);
    setIsLoading(false);
    setCreate(false);
    reset({});
    // this is updating a categories context so that when any category is updated
    // we also trigger an update to refresh call from api for sidemenu navigation
    setRefresh((prevState) => prevState + 1);
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

    if (lessonId) {
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

  // found this to prevent form submission for windows PC chrome/IE
  const checkKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <>
      <section>
        <div className="tab-pane fade show active" id="users">
          <div className="card">
            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={checkKeyDown}>
              <LessonAdminHeader
                lessonId={lessonId}
                lessonForm={lessonForm}
                dispatch={dispatch}
                handleSubmit={handleSubmit}
                loading={loading}
                loadingPublish={loadingPublish}
                onHandlePublish={onHandlePublish}
                isPublish={isPublish}
                goBack={setCreate}
                errors={errors}
                register={register}
              />

              <LessonForm
                lessonId={lessonId}
                lessonForm={lessonForm}
                dispatch={dispatch}
                pdf={pdf}
                setPdf={setPdf}
                onAddPage={onAddPage}
                pages={pages}
                onSetPageInfo={onSetPageInfo}
                onRemovePage={onRemovePage}
                setErrorMessage={setErrorMessage}
                setSuccessMessage={setLessonSuccess}
                onHandleChangeOrder={onHandleChangeOrder}
                errors={errors}
                register={register}
                setValue={setValue}
                control={control}
                goBack={setCreate}
              />
            </form>
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
          message={lessonSuccess}
          setMessage={setLessonSuccess}
        />
      </AlertWrapper>
    </>
  );
};

export default LessonAdminView;
