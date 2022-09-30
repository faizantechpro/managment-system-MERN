import { useReducer, useState } from 'react';
import Mousetrap from 'mousetrap';
import { useHistory } from 'react-router-dom';

import contactService from '../../services/contact.service';
import {
  ADD_CONTACT,
  CONTACT_CREATED,
  EMPTY_NAME,
  INVALID_EMAIL,
} from '../../utils/constants';
import { validateEmail } from '../../utils/Utils';
import { initialPeopleForm } from '../../views/Deals/contacts/Contacts.constants';
import { onHandleCloseModal, reducer } from '../../views/Deals/contacts/utils';
import SimpleModalCreation from '../modal/SimpleModalCreation';
import PeopleForm from './PeopleForm';

const AddPeople = ({
  children,
  openPeople,
  setOpenPeople,
  successMessage,
  setSuccessMessage,
  errorMessage,
  setErrorMessage,
  allOwners,
  getContacts,
  fromNavbar,
  setOpenList,
  searchValue,
}) => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [preOwners, setPreOwners] = useState([]);

  const [peopleFormData, dispatchFormData] = useReducer(
    reducer,
    initialPeopleForm
  );

  Mousetrap.bind(`shift+p`, () => setOpenPeople(true));

  const toggle = () => {
    setOpenPeople(!openPeople);
    setOpenList(false);
  };

  const onClose = () => {
    onHandleCloseModal(dispatchFormData, toggle, 'reset-Form');
  };

  const onHandleSubmit = async () => {
    setLoading(true);

    if (!peopleFormData.first_name || !peopleFormData.last_name) {
      setLoading(false);

      return setErrorMessage(EMPTY_NAME);
    }

    const isEmail = peopleFormData.email && validateEmail(peopleFormData.email);

    if (peopleFormData.email && !isEmail) {
      setLoading(false);

      return setErrorMessage(INVALID_EMAIL);
    }

    const newContact = await contactService
      .createContact(peopleFormData)
      .catch((err) => console.log(err));

    if (newContact) {
      await Promise.all(
        preOwners?.map(async (item) => {
          await new Promise((resolve) => {
            contactService
              .addOwner(newContact?.data?.id, item.user_id)
              .then(resolve);
          });
        })
      );

      getContacts && getContacts();

      dispatchFormData({
        type: 'reset-peopleForm',
      });
      setPreOwners([]);

      setSuccessMessage(CONTACT_CREATED);

      toggle();

      if (fromNavbar) {
        history.push(`/contacts/${newContact?.data?.id}/profile`);
      }
    }

    setLoading(false);
  };

  return (
    <>
      {children}
      <SimpleModalCreation
        modalTitle={ADD_CONTACT}
        open={openPeople}
        toggle={onClose}
        handleSubmit={onHandleSubmit}
        onHandleCloseModal={() =>
          onHandleCloseModal(dispatchFormData, toggle, 'reset-peopleForm')
        }
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        isLoading={loading}
        onClick={() => document.dispatchEvent(new MouseEvent('click'))}
      >
        <PeopleForm
          dispatch={dispatchFormData}
          allUsers={allOwners}
          peopleFormData={peopleFormData}
          refresh={() => getContacts()}
          searchValue={searchValue}
          isprincipalowner="true"
          prevalue="true"
          preowners={preOwners}
          setPreOwners={setPreOwners}
        />
      </SimpleModalCreation>
    </>
  );
};

export default AddPeople;
