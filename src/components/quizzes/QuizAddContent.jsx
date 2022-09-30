import { Button } from 'reactstrap';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import {
  ADD_QUIZ,
  FIRST_SLIDE_PRESENTATION,
  QUIZ,
  QUIZ_QUESTION_LABEL,
} from '../../utils/constants';
import QuizAdminPage from './QuizAdminPage';

const QuizAddContent = ({
  quizId,
  onAddPage,
  pages,
  onSetPageInfo,
  onRemovePage,
  setErrorMessage,
  onHandleChangeOrder,
}) => {
  const onAddQuiz = () => {
    onAddPage({
      type: QUIZ,
      placeholder: QUIZ_QUESTION_LABEL,
    });
  };

  return (
    <div>
      <DragDropContext onDragEnd={onHandleChangeOrder}>
        <Droppable droppableId="pagesDrop">
          {(droppableProvided) => (
            <div
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              {pages?.map((itemPage, index) => (
                <Draggable
                  key={itemPage.id}
                  draggableId={itemPage?.id?.toString()}
                  index={index}
                >
                  {(draggableProvider) => (
                    <div
                      {...draggableProvider.draggableProps}
                      ref={draggableProvider.innerRef}
                      {...draggableProvider.dragHandleProps}
                    >
                      <QuizAdminPage
                        quizId={quizId}
                        {...itemPage}
                        onSetPageInfo={onSetPageInfo}
                        onRemovePage={onRemovePage}
                        setErrorMessage={setErrorMessage}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="card bg-light rounded d-flex justify-content-center align-items-center slide-notification-wrapper">
        <div className="text-center">
          <p className="slide-notification">{FIRST_SLIDE_PRESENTATION}</p>
          <div className="d-flex justify-content-around slide-button-wrapper">
            <Button color="primary" className="bw-large" onClick={onAddQuiz}>
              <span className="material-icons-outlined mr-2">analytics</span>
              {ADD_QUIZ}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAddContent;
