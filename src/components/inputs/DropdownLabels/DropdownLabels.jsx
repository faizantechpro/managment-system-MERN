import { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Badge, Col } from 'reactstrap';

import AddAndEditLabel from './AddAndEditLabel';
import { useProfileContext } from '../../../contexts/profileContext';
import './DropdownLabels.css';

const DropdownLabels = ({
  value,
  btnAddLabel,
  options,
  onHandleSelect,
  placeholder,
  getLabels,
  refresh,
  type,
}) => {
  const { profileInfo } = useProfileContext();
  const userId = profileInfo.id;
  const admin = profileInfo?.roleInfo?.admin_access;
  const [showSectionAdd, setShowSectionAdd] = useState(false);
  const [showSectionEdit, setShowSectionEdit] = useState(false);
  const [labelSelected, setLabelSelected] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setLabelSelected(value);
  }, [value]);

  const closeAddandEdit = (value) => {
    setIsMenuOpen(value);
    setShowSectionAdd(false);
    setShowSectionEdit(false);
  };

  const selectLabel = (item) => {
    setLabelSelected(item);
    if (item) onHandleSelect(item);
    setShowSectionAdd(false);
    setShowSectionEdit(false);
    setIsMenuOpen(false);
  };

  return (
    <Dropdown
      className={`w-100 border-1 rounded`}
      show={isMenuOpen}
      onToggle={(isOpen, event, metadata) => {
        if (metadata.source !== 'select') {
          setIsMenuOpen(isOpen);
          setShowSectionAdd(false);
          setShowSectionEdit(false);
        }
      }}
    >
      <Dropdown.Toggle
        className={`w-100 form-control dropdown-search ${
          labelSelected ? 'text-black' : ''
        }`}
        variant="outline-link"
        disabled={!options}
      >
        {labelSelected ? (
          <Badge
            id={labelSelected.id}
            style={{
              fontSize: '12px',
              backgroundColor: `${labelSelected.color}`,
            }}
            className="text-uppercase px-2 w-auto"
          >
            {labelSelected.name}
          </Badge>
        ) : (
          `${placeholder}`
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu className={`w-100 menu-labels pb-0`}>
        {!showSectionAdd && !showSectionEdit ? (
          <div>
            <Col className="list-labels">
              {options.length
                ? options.map((item) => (
                    <Dropdown.Item
                      key={`${item.id}-${item.name}`}
                      className="px-3 pb-2 pt-2 d-flex align-items-center"
                      onClick={() => selectLabel(item)}
                    >
                      <Badge
                        id={item.id}
                        style={{
                          fontSize: '12px',
                          backgroundColor: `${item.color}`,
                        }}
                        className="text-uppercase px-2 w-auto border"
                      >
                        {item.name}
                      </Badge>
                      <Col className="p-0 text-right">
                        {item?.assigned_user_id === userId || admin ? (
                          <i
                            className="material-icons-outlined mr-2"
                            data-uw-styling-context="true"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowSectionEdit(true);
                              setLabelSelected(item);
                            }}
                          >
                            edit
                          </i>
                        ) : null}
                        {labelSelected?.id === item?.id ? (
                          <i
                            className="material-icons-outlined mr-2"
                            data-uw-styling-context="true"
                          >
                            check
                          </i>
                        ) : null}
                      </Col>
                    </Dropdown.Item>
                  ))
                : null}
            </Col>
            <p
              className="btn border w-100 m-0"
              onClick={(e) => {
                e.stopPropagation();
                setShowSectionAdd(true);
              }}
            >
              <i
                className="material-icons-outlined mr-2"
                data-uw-styling-context="true"
              >
                add
              </i>
              {btnAddLabel}
            </p>
          </div>
        ) : (
          <AddAndEditLabel
            sectionAdd={showSectionAdd}
            sectionEdit={showSectionEdit}
            label={labelSelected}
            setIsMenuOpen={closeAddandEdit}
            selectLabel={(label) => selectLabel(label)}
            getLabels={getLabels}
            refresh={refresh}
            type={type}
          />
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownLabels;
