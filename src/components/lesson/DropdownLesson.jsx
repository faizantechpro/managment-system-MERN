import React from 'react';
import { Col, Form, Dropdown } from 'react-bootstrap';

import stringConstants from '../../utils/stringConstants.json';
import MaterialIcon from '../commons/MaterialIcon';
import TooltipComponent from './Tooltip';

const constants = stringConstants.settings.resources.courses;

const List = ({ children, className }) => {
  return (
    <Col xs={12} className={`px-0 mt-3 ${className}`}>
      {children}
    </Col>
  );
};

const DropdownLesson = ({
  id,
  onChange,
  value,
  name,
  placeholder,
  results,
  error,
  selection,
  setSelection,
  title,
  children,
  onDeleteLesson,
}) => {
  const handleCollapse = () => {
    const dropdownMenu = document.getElementById(id);
    dropdownMenu.classList.remove('show');
  };

  return (
    <Dropdown drop="down" className="rounded">
      <Dropdown.Toggle
        className="w-100 dropdown-search"
        variant="outline-link"
        id="dropdown"
      >
        {title}
      </Dropdown.Toggle>
      <Dropdown.Menu className="w-100" id={id}>
        <Col xs={12} className="px-3">
          {error.error && (
            <p className="alert-danger px-3 py-1 mb-1 rounded">{error.msg}</p>
          )}
          <Form.Control
            type="text"
            onChange={onChange}
            id={name}
            name={name}
            placeholder={placeholder}
            results={results}
            maxLength={100}
          />
          <List className="dropdown-results">
            {value.length > 1 && (
              <p className="alert-light mb-1 px-1 py-0 text-center rounded">
                {constants.labelAddLesson}
              </p>
            )}

            {results?.map((lesson, index) => {
              const lessonToAdd = {
                title: lesson.title,
                category: lesson?.category?.title,
                id: lesson.id,
              };

              const checkUserAdded = selection.some(
                (item) => item.id === lesson.id
              );

              const handleCheckUncheckLesson = () => {
                if (checkUserAdded) {
                  onDeleteLesson();
                } else {
                  selection
                    ? setSelection((selection) => [...selection, lessonToAdd])
                    : setSelection(lessonToAdd);
                }
                handleCollapse();
              };

              return (
                <div
                  id={`lesson-${index}`}
                  key={index}
                  onClick={handleCheckUncheckLesson}
                  className="d-flex rounded py-2 bg-hover-gray-dark cursor-pointer align-items-center justify-content-between"
                >
                  <h5 className="mb-0 pl-3">{lesson.title || ''}</h5>
                  <div>
                    {!checkUserAdded && (
                      <p
                        className="btn btn-xs text-center mb-0 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!checkUserAdded) {
                            selection
                              ? setSelection((selection) => [
                                  ...selection,
                                  lessonToAdd,
                                ])
                              : setSelection(lessonToAdd);
                            handleCollapse();
                          }
                        }}
                      >
                        <TooltipComponent title="Add">
                          <MaterialIcon icon="add" clazz="text-primary" />
                        </TooltipComponent>
                      </p>
                    )}
                    {checkUserAdded && (
                      <p
                        className="btn btn-xs text-center mb-0 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteLesson();
                          handleCollapse();
                        }}
                      >
                        <TooltipComponent title="Delete">
                          <MaterialIcon icon="delete" clazz="text-danger" />
                        </TooltipComponent>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </List>
        </Col>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownLesson;
