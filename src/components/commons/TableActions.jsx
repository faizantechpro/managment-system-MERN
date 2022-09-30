import MaterialIcon from './MaterialIcon';
import TooltipComponent from '../lesson/Tooltip';
import React from 'react';

const ActionItem = ({ item, action }) => {
  return (
    <TooltipComponent title={action.title}>
      <a
        onClick={(e) => {
          e.stopPropagation();
          action.onClick(item);
        }}
        className="cursor-pointer"
      >
        <MaterialIcon icon={action.icon} clazz={action.style || 'text-blue'} />{' '}
      </a>
    </TooltipComponent>
  );
};

// using this where we want to show icons in table action column, for ref: see CategoriesTable.jsx, LessonTable.jsx etc
const TableActions = ({ item, actions }) => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      {actions.map((action, index) => (
        <ActionItem key={index} item={item} action={action} />
      ))}
    </div>
  );
};

export default TableActions;
