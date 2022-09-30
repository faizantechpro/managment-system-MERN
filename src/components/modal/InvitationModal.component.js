import React, { useState, useEffect } from 'react';
import {
  Spinner,
  // Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { toArray } from 'lodash';

import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import AddUsers from '../manageUsers/AddUsers';
import userService from '../../services/user.service';
import { validateEmail } from '../../utils/Utils';
import { ROLE_LABEL, TENANT_LABEL } from '../../utils/constants';
import IdfSelectRole from '../idfComponents/idfDropdown/IdfSelectRole';
import ValidateAdminAccess from '../validateAdminAccess/ValidateAdminAccess';
import IdfSelectTenant from '../idfComponents/idfDropdown/IdfSelectTenant';

const InvitationModal = ({ showModal, setShowModal }) => {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sentReport, setSentReport] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchRole, setSearchRole] = useState({});
  const [roleSelection, setRoleSelection] = useState({});
  const [tenantSelection, setTenantSelection] = useState(undefined);

  const onHandleCloseModal = () => {
    setInputValue('');
    setEmails([]);
    setSentReport([]);
    setShowModal(false);
    setSearchRole({});
  };

  useEffect(() => {
    if (emails.length > 5) {
      setErrorMessage('You can only invite up to 5 users at once');
    } else {
      setErrorMessage('');
    }
  }, [emails]);

  const sendInvitations = async () => {
    let emailList = emails;
    if (inputValue && validateEmail(inputValue)) {
      emailList = [...emailList, inputValue];
      setInputValue('');
    }
    const invitationInfo = {
      emails: toArray(emailList),
      role: roleSelection?.id,
      tenant: tenantSelection?.id,
    };

    const invitationsResults = await userService.invite(invitationInfo);

    return invitationsResults;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const sentEmails = await sendInvitations();
    setSentReport(sentEmails);
    setTenantSelection(undefined);
    setIsLoading(false);
  };

  const closeBtn = (
    <button
      className="close"
      style={{ fontSize: '30px' }}
      onClick={onHandleCloseModal}
    >
      &times;
    </button>
  );

  const onHandleChangeSelect = (e) => {
    const { value, name } = e.target;
    if (name === 'tenant') {
      setTenantSelection(value);
    } else {
      setSearchRole({
        ...searchRole,
        search: value?.name,
      });

      setRoleSelection(value);
    }
  };

  return (
    <Modal isOpen={showModal} fade={false} size="lg">
      <ModalHeader tag="h2" close={closeBtn}>
        Add Users
      </ModalHeader>
      <ModalBody>
        <AlertWrapper>
          <Alert
            message={errorMessage}
            setMessage={setErrorMessage}
            color="danger"
          />
        </AlertWrapper>
        <AddUsers
          inputValue={inputValue}
          setInputValue={setInputValue}
          setEmails={setEmails}
          emails={emails}
          sentReport={sentReport}
        />
        {sentReport.length === 0 && (
          <div className="row form-group">
            {/* Tenant Dropdown */}
            <ValidateAdminAccess onlyAdmin>
              <label className="col-sm-1 col-form-label input-label">
                <b>{TENANT_LABEL}:</b>
              </label>
              <div className="col-sm-11">
                <IdfSelectTenant
                  id="selectRoleDropdown"
                  onChange={onHandleChangeSelect}
                  value={tenantSelection}
                />
              </div>
            </ValidateAdminAccess>

            {/* Roles Dropdown */}
            <label className="col-sm-1 col-form-label input-label">
              <b>{ROLE_LABEL}:</b>
            </label>
            <div className="col-sm-11">
              <IdfSelectRole
                id="selectRoleDropdown"
                onChange={onHandleChangeSelect}
                value={searchRole}
                query={{ page: 1, limit: 20 }} // TODO: Define if the roles dropdown will have pagination
              />
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        {sentReport.length > 0 ? (
          <>
            <button
              className="btn btn-white"
              data-dismiss="modal"
              onClick={onHandleCloseModal}
            >
              Ok
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-white"
              data-dismiss="modal"
              onClick={onHandleCloseModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={errorMessage}
            >
              {isLoading ? <Spinner /> : <span>Send Invite</span>}
            </button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default InvitationModal;
