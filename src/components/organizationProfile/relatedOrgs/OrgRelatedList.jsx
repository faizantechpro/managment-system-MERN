import React, { useState } from 'react';
import { Badge } from 'reactstrap';

import ModalConfirmDefault from '../../modal/ModalConfirmDefault';
import stringConstants from '../../../utils/stringConstants.json';
import ProfileCardItem from '../../peopleProfile/ProfileCardItem';

const constants = stringConstants.deals.organizations;

const OrgRelatedList = ({
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

  const name = item?.related_organization_name;

  return (
    <div className="mb-2">
      <ModalConfirmDefault
        loading={loading}
        open={openModal}
        onHandleConfirm={handleConfirm}
        onHandleClose={() => setOpenModal(false)}
        textBody={`Are you sure you want to remove ${name} as ${item?.calculated_type}?`}
        labelButtonConfirm={constants.acceptConfirmation}
        iconButtonConfirm="delete"
        colorButtonConfirm="outline-danger"
      />
      <div className="media align-items-center justify-content-between">
        <div className="mr-auto">
          <ProfileCardItem
            user={item}
            mainOwner={mainOwner}
            size="xs"
            org={true}
          />
        </div>
        <div className="ml-auto">
          {item?.calculated_type && (
            <Badge
              id={item.id}
              style={{
                fontSize: '12px',
                borderRadius: 40,
                backgroundColor: '#e6e6e6',
                color: 'black',
              }}
              className="text-uppercase"
            >
              {item?.calculated_type}
            </Badge>
          )}
        </div>
        {handleRemove && (
          <div
            style={{ width: '10%' }}
            className={'d-flex justify-content-center'}
          >
            {item?.calculated_type !== 'sister' &&
              handleRemove &&
              isPrincipalOwner && (
                <button
                  className="btn btn-icon btn-sm btn-ghost-danger rounded-circle"
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

export default OrgRelatedList;
