import { ListGroupItem } from 'react-bootstrap';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const BlockItem = ({
  children,
  index,
  isDraggable,
  style = 'border-bottom',
}) => {
  return (
    <>
      {isDraggable ? (
        <Draggable
          key={`block-${index}`}
          draggableId={`id-block-${index}`}
          index={index}
        >
          {(provided, snapshot) => (
            <ListGroupItem
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`px-4 pt-3 pb-4 report-block list-group-item ${style} ${
                snapshot.isDragging ? 'shadow-lg border rounded-lg' : ''
              }`}
            >
              {children}
            </ListGroupItem>
          )}
        </Draggable>
      ) : (
        <ListGroupItem
          className={`px-4 pt-3 pb-4 report-block list-group-item ${style}`}
        >
          {children}
        </ListGroupItem>
      )}
    </>
  );
};

export default BlockItem;
