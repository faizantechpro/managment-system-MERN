import React, { useState } from 'react';
import { Badge } from 'reactstrap';

import ModalConfirmDefault from '../../modal/ModalConfirmDefault';
import stringConstants from '../../../utils/stringConstants.json';
import ProfileCardItem from '../ProfileCardItem';
import MaterialIcon from '../../commons/MaterialIcon';

const constants = stringConstants.deals.organizations;

const ContactOwnerList = ({
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

  const handleCloseModal = () => {
    setLoading(false);
    setOpenModal(false);
  };

  const handleConfirmModal = async () => {
    setLoading(true);
    await handleRemove();
    setLoading(false);
    setOpenModal(false);
  };

  const ownerInfo = item?.user;
  const ownerType =
    ownerInfo?.type === 'owner'
      ? 'Secondary'
      : ownerInfo?.type === 'primaryOwner'
      ? 'Primary'
      : 'Follower';

  return (
    <div className="list-group list-group-lg list-group-flush list-group-no-gutters">
      <ModalConfirmDefault
        loading={loading}
        open={openModal}
        onHandleConfirm={handleConfirmModal}
        onHandleClose={handleCloseModal}
        textBody={constants.deleteConfirmation}
        labelButtonConfirm={constants.acceptConfirmation}
        iconButtonConfirm="delete"
        colorButtonConfirm="outline-danger"
      />
      <div
        data-testid={`item-${item?.user_id}`}
        key={`${item?.user_id}-${item?.contact_id}`}
        className="list-group-item py-0"
      >
        <div className="media align-items-center justify-content-between">
          <div className="mr-auto">
            <ProfileCardItem user={ownerInfo} mainOwner={mainOwner} size="xs" />
          </div>
          <div className="ml-auto">
            {ownerType && (
              <Badge
                id={ownerInfo?.id}
                style={{
                  fontSize: '12px',
                  borderRadius: 40,
                  color:
                    ownerType === 'Primary' || item?.user?.type === 'owner'
                      ? 'white'
                      : 'black',
                  backgroundColor: `${
                    ownerType === 'Primary'
                      ? 'green'
                      : item?.user?.type === 'owner'
                      ? 'blue'
                      : '#e6e6e6'
                  }`,
                }}
                className="text-uppercase"
              >
                {ownerType}
              </Badge>
            )}
          </div>

          {handleRemove && (
            <div
              style={{ width: '10%' }}
              className={'d-flex justify-content-center'}
            >
              {isPrincipalOwner &&
                item?.user_id !== mainOwner?.id &&
                ownerInfo?.type === 'owner' && (
                  <button
                    className="btn btn-icon btn-sm btn-ghost-danger rounded-circle"
                    onClick={removeItem}
                  >
                    <MaterialIcon icon="delete" />
                  </button>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactOwnerList;
