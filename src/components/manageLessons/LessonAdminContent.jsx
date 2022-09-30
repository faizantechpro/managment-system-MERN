import { Button } from 'reactstrap';

import {
  ADD_SLIDE,
  ADD_VIDEO,
  SLIDE,
  VIDEO,
  VIDEO_LINK_FORMAT,
} from '../../utils/constants';
import LessonAdminPage from './LessonAdminPage';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const LessonAdminContent = ({
  onAddPage,
  pages,
  onSetPageInfo,
  onRemovePage,
  setErrorMessage,
  onHandleChangeOrder,
  lessonId,
}) => {
  return (
    <div className="p-3 pt-0">
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
                      <LessonAdminPage
                        lessonId={lessonId}
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

      <div className="card bg-gray-200 rounded d-flex justify-content-center align-items-center min-h-120">
        <div className="text-center">
          <div className="d-flex justify-content-center slide-button-wrapper">
            <Button
              color="primary"
              className="bw-large mr-2"
              onClick={() => onAddPage({ type: SLIDE, placeholder: 'Title' })}
            >
              <span
                className="material-icons-outlined mr-2"
                data-uw-styling-context="true"
              >
                description
              </span>
              {ADD_SLIDE}
            </Button>

            <Button
              color="primary"
              className="bw-large"
              onClick={() =>
                onAddPage({ type: VIDEO, placeholder: VIDEO_LINK_FORMAT })
              }
            >
              <span
                className="material-icons-outlined mr-2"
                data-uw-styling-context="true"
              >
                smart_display
              </span>
              {ADD_VIDEO}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonAdminContent;
