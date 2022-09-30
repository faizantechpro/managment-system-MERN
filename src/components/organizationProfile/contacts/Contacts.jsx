import React, { useState, useEffect } from 'react';

import Alert from '../../Alert/Alert';
import AddContact from './AddContact';
import OrgContactsList from './OrgContactsList';
import AlertWrapper from '../../Alert/AlertWrapper';
import contactService from '../../../services/contact.service';
import stringConstants from '../../../utils/stringConstants.json';
import OrganizationContactsModal from '../../modal/OrganizationContactsModal';
import EmptyDataButton from '../../emptyDataButton/EmptyDataButton';

const constants = stringConstants.deals.organizations.profile;

const Contacts = ({
  organizationId,
  getProfileInfo,
  isPrincipalOwner,
  mainOwner,
}) => {
  const [contacts, setContacts] = useState([]);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [pagination, setPagination] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const contactLimit = 5;

  const getContacts = () => {
    contactService
      .getContactsByorganizationId({ organizationId }, { limit: contactLimit })
      .then((res) => {
        setContacts(res.contacts);
        setPagination(res.pagination);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProfile = () => {
    getProfileInfo();
    getContacts();
  };

  const handleRemove = async (item) => {
    try {
      await contactService.unlinkOrganization(item.id, item.organization_id);
      getProfile();
    } catch (error) {
      if (error.message) {
        return setErrorMessage(error.message);
      }
      return setErrorMessage(error);
    }
  };

  useEffect(() => {
    if (!showContactsModal) {
      getContacts();
    }
  }, [showContactsModal]);

  return (
    <div className="card mt-4">
      <AlertWrapper>
        <Alert
          message={errorMessage}
          setMessage={setErrorMessage}
          color="danger"
        />
        <Alert
          message={successMessage}
          setMessage={setSuccessMessage}
          color="success"
        />
      </AlertWrapper>
      <OrganizationContactsModal
        showModal={showContactsModal}
        setShowModal={setShowContactsModal}
        organizationId={organizationId}
        handleRemove={handleRemove}
        isPrincipalOwner={isPrincipalOwner}
      />
      <div className="card-header py-2">
        <h4 className="card-title">{constants.contactsTitle}</h4>
        <div className="ml-auto">
          <AddContact
            organizationId={organizationId}
            getContacts={getProfile}
            setShowAddContactModal={setShowAddContactModal}
            showAddContactModal={showAddContactModal}
            onHandleShowAlertSuccess={setSuccessMessage}
            onHandleShowAlertFailed={setErrorMessage}
          >
            <button
              className="btn btn-icon btn-sm btn-ghost-primary rounded-circle"
              onClick={() => setShowAddContactModal(true)}
            >
              <i className="material-icons-outlined">add</i>
            </button>
          </AddContact>
        </div>
      </div>

      <div className="card-body py-0">
        <div className="list-group list-group-lg list-group-flush list-group-no-gutters py-1">
          {contacts.length === 0 && (
            <AddContact
              organizationId={organizationId}
              getContacts={getContacts}
              setShowAddContactModal={setShowAddContactModal}
              showAddContactModal={showAddContactModal}
              onHandleShowAlertSuccess={setSuccessMessage}
              onHandleShowAlertFailed={setErrorMessage}
            >
              <EmptyDataButton
                setOpenModal={setShowAddContactModal}
                message=""
                buttonLabel="Add Additional Contacts"
              />
            </AddContact>
          )}
          {contacts?.slice(0, contactLimit)?.map((item) => (
            <OrgContactsList
              item={item}
              key={item.id}
              isPrincipalOwner={isPrincipalOwner}
              mainOwner={mainOwner}
            />
          ))}
        </div>
      </div>
      {pagination.count > 0 && (
        <div className="card-footer">
          <button
            className="btn btn-white btn-sm"
            onClick={() => {
              setShowContactsModal(true);
            }}
          >
            View all
            <span className="material-icons-outlined">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Contacts;
