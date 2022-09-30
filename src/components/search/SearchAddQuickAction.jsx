/** Component for quick add actions when no result found in global search */
import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import AddOrganization from '../organizations/AddOrganization';
import AddDeal from '../peopleProfile/deals/AddDeal';
import AddPeople from '../peoples/AddPeople';
import AddNewActivityModal from '../steps/feedTypes/AddNewActivityModal';

const DropdownChildren = ({ item, searchValue }) => {
  return (
    <div className="w-100 d-flex align-items-center justify-content-center text-block">
      <div>
        <i className="material-icons-outlined list-group-icon mr-2">
          {item.icon}
        </i>
        <span className="font-weight-medium">
          Add {item.title} <q>{searchValue}</q>
        </span>
      </div>
    </div>
  );
};

const NavbarFilters = ({ type, searchValue }) => {
  const [openDeal, setOpenDeal] = useState(false);
  const [openOrganization, setOpenOrganization] = useState(false);
  const [openActivity, setOpenActivity] = useState(false);
  const [openPeople, setOpenPeople] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [, setOpenList] = useState(false);

  const options = [
    {
      title: 'Deal',
      id: 'deal',
      icon: 'monetization_on',
      shortcut: 'D',
      callbackFunction: setOpenDeal,
      component: (
        <AddDeal
          className="btn-transparent"
          setOpenDeal={setOpenDeal}
          openDeal={openDeal}
          setOpenList={setOpenList}
          searchValue={searchValue}
        />
      ),
    },
    {
      title: 'Activity',
      icon: 'event',
      id: 'activity',
      shortcut: 'A',
      callbackFunction: setOpenActivity,
      component: (
        <AddNewActivityModal
          openActivity={openActivity}
          setOpenActivity={setOpenActivity}
          setOpenList={setOpenList}
          searchValue={searchValue}
        />
      ),
    },
    {
      title: 'Person',
      id: 'contact',
      icon: 'person',
      shortcut: 'C',
      callbackFunction: setOpenPeople,
      component: (
        <AddPeople
          openPeople={openPeople}
          setOpenPeople={setOpenPeople}
          setOpenList={setOpenList}
          searchValue={searchValue}
        />
      ),
    },
    {
      title: 'Organization',
      id: 'organization',
      icon: 'business',
      shortcut: 'O',
      callbackFunction: setOpenOrganization,
      component: (
        <AddOrganization
          openOrganization={openOrganization}
          setOpenOrganization={setOpenOrganization}
          setOpenList={setOpenList}
          searchValue={searchValue}
        />
      ),
    },
  ];

  return (
    <>
      <div>
        {options?.map((item) => {
          const { component, ...restProps } = item;

          return (
            <>
              {item.id === type || !type ? (
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
                    <DropdownChildren item={item} searchValue={searchValue} />
                  )}
                </Dropdown.Item>
              ) : (
                ''
              )}
            </>
          );
        })}
      </div>

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
