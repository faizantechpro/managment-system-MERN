import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import MentionsInput from '../../mentions/MentionsInput';
import Alert from '../../Alert/Alert';
import AlertWrapper from '../../Alert/AlertWrapper';
import feedService from '../../../services/feed.service';
import stringConstants from '../../../utils/stringConstants.json';
import IdfSelectMultiOpp from '../../idfComponents/idfDropdown/IdfSelectMultiOpp';
import routes from '../../../utils/routes.json';

const constants = stringConstants.deals.contacts.profile;

const AddNote = ({
  contactId,
  getProfileInfo,
  organizationId,
  dealId,
  getDeal,
  fromNavbar,
  onChange,
  setOpenNote,
  setOverlay,
  from,
  feedInfoNotes,
  defaultState,
  notes,
  richNote,
  setRichNote,
  placeholder,
}) => {
  const history = useHistory();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const getRedirect = () => {
    if (contactId) {
      history.push(`${routes.contacts}/${contactId}/profile`);
    } else if (organizationId) {
      history.push(`${routes.contacts}/${organizationId}/organization/profile`);
    } else if (dealId) {
      history.push(`${routes.dealsPipeline}/${contactId}`);
    }
  };

  const handleSubmit = async (raw) => {
    if (contactId === null && organizationId === null && dealId === null) {
      setErrorMessage(constants.organizationContactDealSelectMsg);
    } else {
      try {
        await feedService.createNote(raw, contactId, organizationId, dealId);
        setSuccessMessage(constants.noteAdded);
        if (dealId) getDeal();
        if (getProfileInfo) getProfileInfo();

        if (fromNavbar) {
          setTimeout(() => {
            setOpenNote(false);
            getRedirect();
          }, 3000);
        }
      } catch (error) {
        setErrorMessage(constants.noteError);
      }

      if (fromNavbar) {
        setTimeout(() => setOpenNote(false), 3000);
      }
    }
  };

  return (
    <div className={!fromNavbar ? 'mb-1 py-2' : ''}>
      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>

      {fromNavbar && <IdfSelectMultiOpp onChange={onChange} />}

      <MentionsInput
        defaultState={defaultState}
        handleSubmit={handleSubmit}
        alignButtons={`right`}
        setOverlay={setOverlay}
        from={from}
        notes={notes}
        feedInfoNotes={feedInfoNotes}
        richNote={richNote}
        setRichNote={setRichNote}
        placeholder={placeholder}
      />
    </div>
  );
};

export default AddNote;
