import { useState } from 'react';

import LessonsTable from '../components/manageLessons/LessonsTable';
import LessonAdminView from '../views/Resources/LessonAdminView';

const ManageLessons = () => {
  const [create, setCreate] = useState(false);
  const [id, setId] = useState();

  return (
    <>
      {create ? (
        <LessonAdminView
          lessonId={id}
          setLessonId={setId}
          setCreate={setCreate}
        />
      ) : (
        <LessonsTable setCreate={setCreate} setId={setId} />
      )}
    </>
  );
};

export default ManageLessons;
