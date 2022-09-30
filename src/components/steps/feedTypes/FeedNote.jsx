import React, { useState } from 'react';

import feedService from '../../../services/feed.service';
import AlertWrapper from '../../Alert/AlertWrapper';
import Alert from '../../Alert/Alert';
import MoreActions from '../../MoreActions';
import MentionsInput from '../../mentions/MentionsInput';
import stringConstants from '../../../utils/stringConstants.json';

const constants = stringConstants.deals.contacts.profile;

export const items = () => {
  return [
    {
      id: 'edit',
      icon: 'edit',
      name: 'Edit',
    },
  ];
};

const FeedNote = ({ data, feedId, getProfileInfo, isOwner }) => {
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const closeAddComment = () => {
    setNote(null);
  };

  const onHandleEdit = () => {
    setIsLoading(false);
    setNote(data);
  };

  const handleUpdate = async (raw) => {
    try {
      const { id } = note;
      await feedService.updateNote(feedId, id, raw);

      setNote(null);

      getProfileInfo(constants.noteUpdated);
    } catch (error) {
      if (error.response.status === 401) {
        setNote(null);
        return setErrorMessage(constants.unathorizedError);
      }

      setErrorMessage(constants.noteError);
    }
  };

  return (
    <div className="card" style={{ backgroundColor: '#FFF8BC' }}>
      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      <div className="card-body d-flex pb-0">
        <div className="mr-2  w-100">
          {note === null ? (
            <>
              {data?.description && !data?.note ? (
                <div dangerouslySetInnerHTML={{ __html: data.description }} />
              ) : (
                <MentionsInput defaultState={data.note} readOnly />
              )}
            </>
          ) : (
            <div className="pl-4 comments-container">
              <MentionsInput
                defaultState={note?.description || note?.note}
                type={`comment`}
                handleSubmit={handleUpdate}
                submitLabel={`Update`}
                isLoading={isLoading}
                onHandleCancel={closeAddComment}
              />
              <hr />
            </div>
          )}
        </div>
        {isOwner && (
          <div className="cards-btn-deals ml-auto d-flex flex-column align-items-start">
            <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
              <MoreActions items={items()} onHandleEdit={onHandleEdit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

FeedNote.defaultProps = {
  data: {},
};

export default FeedNote;
