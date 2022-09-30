import { useEffect, useState } from 'react';

import lessonService from '../../services/lesson.service';
import {
  AFFIRMATIVE_ANSWER,
  CANT_REMOVE,
  LESSON_DELETE_CONFIRMATION,
} from '../../utils/constants';
import ModalConfirm from '../modal/ModalConfirmDefault';

const DeleteLesson = (props) => {
  const {
    removeLessonModal,
    onDeleteLesson,
    toggleModal,
    modalLoading,
    setModalLoading,
    lessonId,
  } = props;

  const [notDelete, setNotDelete] = useState(false);

  const getTrack = async () => {
    setModalLoading(true);

    const tracked = await lessonService
      .GetLessonTracked(lessonId)
      .catch((err) => console.log(err));

    setModalLoading(false);
    if (tracked.length) setNotDelete(true);
  };

  useEffect(() => {
    getTrack();
  }, []);

  return (
    <ModalConfirm
      open={removeLessonModal}
      onHandleConfirm={onDeleteLesson}
      onHandleClose={toggleModal}
      textBody={notDelete ? CANT_REMOVE : LESSON_DELETE_CONFIRMATION}
      labelButtonConfirm={AFFIRMATIVE_ANSWER}
      iconButtonConfirm={notDelete ? 'people' : 'delete'}
      colorButtonConfirm={'outline-danger'}
      icon="report_problem"
      loading={modalLoading}
      disabled={notDelete}
    />
  );
};

export default DeleteLesson;
