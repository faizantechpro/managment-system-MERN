import React, { useState } from 'react';
import { Col } from 'react-bootstrap';

import { MORE_INFORMATION } from '../../utils/constants';
import Avatar from '../Avatar';
import ScheduleCall from './ScheduleCall';
import BankTeam from './BankTeam';

const PublicProfileSidebar = ({ userInfo, organizationId, contactId }) => {
  const [openScheduleCall, setOpenScheduleCall] = useState(false);
  const [openBankTeam, setOpenBankTeam] = useState(false);

  const primaryOwnerContact = `${userInfo?.first_name} ${userInfo?.last_name}`;

  const buttonClick = (callbackFunction) => {
    callbackFunction((prev) => !prev);
  };

  return (
    <Col className="col-md-3 col-lg-2 col-fixed d-flex flex-column align-items-center text-center px-4 py-6 sidebar-min-height">
      <span className="material-icons-outlined text-white fs-74">
        account_balance
      </span>

      <div className="mt-4 mt-md-10">
        <div className="avatar avatar-xl avatar-circle avatar-border-dashed mr-3">
          <Avatar user={userInfo} classModifiers="avatar-xl" />
        </div>
        <h3 className="mb-2 text-white mt-3"> {primaryOwnerContact} </h3>
        <span className="d-block text-gray-200 font-size-sm">
          {userInfo?.title}
        </span>

        <ScheduleCall
          open={openScheduleCall}
          setOpenScheduleCall={setOpenScheduleCall}
          data={userInfo}
          organizationId={organizationId}
          contactId={contactId}
        >
          <button
            className="btn btn-outline-light font-weight-medium mt-5"
            onClick={() => buttonClick(setOpenScheduleCall)}
          >
            <span className="material-icons-outlined mr-1">call</span>
            <span>Schedule Call</span>
          </button>
        </ScheduleCall>

        <BankTeam
          open={openBankTeam}
          setOpenBankTeam={setOpenBankTeam}
          organizationId={organizationId}
        >
          <button
            className="btn btn-outline-light font-weight-medium mt-5"
            onClick={() => buttonClick(setOpenBankTeam)}
          >
            <span className="material-icons-outlined mr-1">group</span>
            <span>Your Bank Team</span>
          </button>
        </BankTeam>

        <div className="mt-5 text-gray-400 font-size-sm">
          <p className="font-size-md font-weight-medium mb-2">
            {MORE_INFORMATION}
          </p>
          <p className="mb-1"> {primaryOwnerContact} </p>
          <p className="mb-1">{userInfo?.phone}</p>
          <p className="mb-0 text-lowercase">{userInfo?.email}</p>
        </div>
      </div>
    </Col>
  );
};

export default PublicProfileSidebar;
