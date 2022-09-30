import { useState } from 'react';
import Mousetrap from 'mousetrap';

import SimpleModalCreation from '../../modal/SimpleModalCreation';
import AddNote from './AddNote';

const AddNewNoteModal = ({
  children,
  openNote,
  setOpenNote,
  successMessage,
  setSuccessMessage,
  errorMessage,
  setErrorMessage,
  fromNavbar,
  setOpenList,
}) => {
  const [contactId, setContactId] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  const [dealId, setDealId] = useState(null);

  Mousetrap.bind(`shift+n`, () => setOpenNote(true));

  const toggle = () => {
    setOpenNote(!openNote);
    setOpenList(false);
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
        modalTitle={'Add Note'}
        open={openNote}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        isLoading={false}
        customModal="modal-dialog-custom"
        onClick={() => document.dispatchEvent(new MouseEvent('click'))}
        noFooter
        toggle={toggle}
      >
        <AddNote
          fromNavbar={fromNavbar}
          contactId={contactId}
          organizationId={organizationId}
          dealId={dealId}
          onChange={onChange}
          setOverlay={toggle}
          setOpenNote={setOpenNote}
        />
      </SimpleModalCreation>
    </>
  );
};

export default AddNewNoteModal;
