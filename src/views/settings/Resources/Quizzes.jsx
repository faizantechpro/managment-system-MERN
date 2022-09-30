import React, { useState } from 'react';

import Quizzes from '../../../components/quizzes/Quizzes';
import CreateQuiz from './CreateQuiz';

const QuizzesView = () => {
  const [create, setCreate] = useState(false);
  const [id, setId] = useState();

  return (
    <>
      {create ? (
        <CreateQuiz quizId={id} setQuizId={setId} setCreate={setCreate} />
      ) : (
        <Quizzes setCreate={setCreate} setId={setId} />
      )}
    </>
  );
};

export default QuizzesView;
