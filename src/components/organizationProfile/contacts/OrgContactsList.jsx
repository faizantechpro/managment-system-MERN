import React, { useState } from 'react';

import ModalConfirmDefault from '../../modal/ModalConfirmDefault';
import stringConstants from '../../../utils/stringConstants.json';
import ProfileCardItem from '../../peopleProfile/ProfileCardItem';

const constants = stringConstants.deals.organizations;

const OrgContactsList = ({
  item,
  handleRemove,
  isPrincipalOwner,
  mainOwner,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const removeItem = () => {
    setOpenModal(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    await handleRemove(item.id);
    setLoading(false);
    setOpenModal(false);
  };

  return (
    <div className="my-0">
      <ModalConfirmDefault
        loading={loading}
        open={openModal}
        onHandleConfirm={handleConfirm}
        onHandleClose={() => setOpenModal(false)}
        textBody={constants.profile.contactDeleteConfirmation}
        labelButtonConfirm={constants.acceptConfirmation}
        iconButtonConfirm="delete"
        colorButtonConfirm="outline-danger"
      />
      <div className="media">
        <ProfileCardItem
          user={item}
          mainOwner={mainOwner}
          size={'xs'}
          contact={true}
        />
        <div className="media-body my-0" />
        {handleRemove && (
          <div
            style={{ width: '10%' }}
            className={'d-flex justify-content-center'}
          >
            {isPrincipalOwner && (
              <button
                className="btn btn-icon btn-sm btn-ghost-danger rounded-circle mt-2"
                onClick={removeItem}
              >
                <i className="material-icons-outlined">delete</i>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgContactsList;
