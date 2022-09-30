import { useState } from 'react';
import Mousetrap from 'mousetrap';

import SimpleModalCreation from '../../modal/SimpleModalCreation';
import AddActivity from '../../peopleProfile/contentFeed/AddActivity';

const AddNewActivityModal = ({
  children,
  openActivity,
  setOpenActivity,
  successMessage,
  setSuccessMessage,
  errorMessage,
  setErrorMessage,
  fromNavbar,
  setOpenList,
  searchValue,
  dealItem,
}) => {
  const [contactId, setContactId] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  const [dealId, setDealId] = useState(dealItem?.id);

  Mousetrap.bind(`shift+a`, () => setOpenActivity(true));

  const toggle = () => {
    setOpenActivity(!openActivity);
    setOpenList && setOpenList(false);
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    const callbackFunction = {
      organization_id: setOrganizationId,
      contact_id: setContactId,
      deal_id: setDealId,
    };

    callbackFunction[name](value);
  };

  return (
    <>
      {children}
      <SimpleModalCreation
        modalTitle={'Add Activity'}
        open={openActivity}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        customModal="modal-dialog-custom"
        onClick={() => document.dispatchEvent(new MouseEvent('click'))}
        noFooter
        bankTeam
      >
        <AddActivity
          componentId="edit-activity"
          contactId={contactId}
          organizationId={organizationId}
          dealId={dealId}
          isModal={true}
          closeModal={toggle}
          fromNavbar={fromNavbar}
          onChange={onChange}
          searchValue={searchValue}
        />
      </SimpleModalCreation>
    </>
  );
};

export default AddNewActivityModal;
