import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import userService from '../../services/user.service';

import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import AddOrganization from '../organizations/AddOrganization';
import AddNewNoteModal from '../peopleProfile/contentFeed/AddNewNoteModal';
import AddDeal from '../peopleProfile/deals/AddDeal';
import AddPeople from '../peoples/AddPeople';
import AddNewActivityModal from '../steps/feedTypes/AddNewActivityModal';

const DropdownChildren = ({ item }) => {
  return (
    <div className="w-100 d-flex align-items-center justify-content-between text-block">
      <div>
        <i className="material-icons-outlined list-group-icon mr-2">
          {item.icon}
        </i>
        <span className="font-weight-medium">{item.title}</span>
      </div>
      <div>
        <span className="badge badge-soft-dark">Shift</span>
        <span> + </span>
        <span className="badge badge-soft-dark">{item.shortcut}</span>
      </div>
    </div>
  );
};

const NavbarFilters = () => {
  const [openDeal, setOpenDeal] = useState(false);
  const [openOrganization, setOpenOrganization] = useState(false);
  const [openActivity, setOpenActivity] = useState(false);
  const [openPeople, setOpenPeople] = useState(false);
  const [openNote, setOpenNote] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openList, setOpenList] = useState(false);
  const [me, setMe] = useState(null);

  const options = [
    {
      title: 'Deal',
      icon: 'monetization_on',
      shortcut: 'D',
      callbackFunction: setOpenDeal,
      component: (
        <AddDeal
          className="btn-transparent"
          setOpenDeal={setOpenDeal}
          openDeal={openDeal}
          setOpenList={setOpenList}
        />
      ),
    },
    {
      title: 'Activity',
      icon: 'event',
      shortcut: 'A',
      callbackFunction: setOpenActivity,
      component: (
        <AddNewActivityModal
          openActivity={openActivity}
          setOpenActivity={setOpenActivity}
          setOpenList={setOpenList}
        />
      ),
    },
    {
      title: 'Person',
      icon: 'person',
      shortcut: 'P',
      callbackFunction: setOpenPeople,
      component: (
        <AddPeople
          openPeople={openPeople}
          setOpenPeople={setOpenPeople}
          setOpenList={setOpenList}
        />
      ),
    },
    {
      title: 'Organization',
      icon: 'business',
      shortcut: 'O',
      callbackFunction: setOpenOrganization,
      component: (
        <AddOrganization
          openOrganization={openOrganization}
          setOpenOrganization={setOpenOrganization}
          setOpenList={setOpenList}
          me={me}
        />
      ),
    },
    {
      title: 'Note',
      icon: 'text_snippet',
      shortcut: 'N',
      callbackFunction: setOpenNote,
      component: (
        <AddNewNoteModal
          openNote={openNote}
          setOpenNote={setOpenNote}
          setOpenList={setOpenList}
        />
      ),
    },
  ];

  useEffect(async () => {
    const me = await getCurrentUser().catch((err) => console.log(err));

    setMe(me);
  }, []);

  const getCurrentUser = async () => {
    const user = await userService
      .getUserInfo()
      .catch((err) => console.error(err));

    return user;
  };

  const renderIcon = () => {
    return (
      <span className="material-icons-outlined border-0">
        {openList ? 'close' : 'add'}
      </span>
    );
  };

  return (
    <>
      <Dropdown
        className="ml-2"
        show={openList}
        onToggle={(isOpen, event, metadata) => {
          if (metadata.source !== 'select') {
            setOpenList(isOpen);
          }
        }}
      >
        <Dropdown.Toggle
          className="btn btn-icon btn-sm rounded-circle dropdown-hide-arrow"
          variant="success"
        >
          {renderIcon()}
        </Dropdown.Toggle>

        <Dropdown.Menu
          id="global-search-drop-list"
          className="border border-1 p-0 w-260"
        >
          {options?.map((item) => {
            const { component, ...restProps } = item;

            return (
              <Dropdown.Item
                as="span"
                key={item.shortcut}
                className="d-flex align-items-center cursor-pointer p-drop-menu"
                onClick={() => item.callbackFunction(true)}
              >
                {React.cloneElement(
                  component,
                  {
                    errorMessage,
                    setErrorMessage,
                    successMessage,
                    setSuccessMessage,
                    fromNavbar: true,
                    ...restProps,
                  },
                  <DropdownChildren item={item} />
                )}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>

      <AlertWrapper>
        <Alert
          message={errorMessage}
          setMessage={setErrorMessage}
          color="danger"
        />
        <Alert
          message={successMessage}
          setMessage={setSuccessMessage}
          color="success"
        />
      </AlertWrapper>
    </>
  );
};

export default NavbarFilters;
