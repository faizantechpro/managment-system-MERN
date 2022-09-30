import React, { useState, useEffect } from 'react';

import SimpleModal from '../../modal/SimpleModal';
import DropdownSearch from '../../DropdownSearch';
import contactService from '../../../services/contact.service';
import stringConstants from '../../../utils/stringConstants.json';

const constants = stringConstants.deals.organizations.profile;

const AddContact = ({
  organizationId,
  getContacts,
  showAddContactModal,
  setShowAddContactModal,
  children,
  onHandleShowAlertSuccess,
  onHandleShowAlertFailed,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('');
  const [data, setData] = useState([]);
  const [isNewContact, setIsNewContact] = useState(false);
  const [newContact, setNewContact] = useState(undefined);

  const searchContacts = async () => {
    try {
      const contacts = await contactService.getContact(
        { organization_id: organizationId, search: filter },
        { limit: 10, page: 1 }
      );
      const { data } = await contactService.getContact(
        { search: filter },
        { limit: 10 + contacts.data.contacts.length, page: 1 }
      );
      const DATA = data.contacts.filter((d) => {
        return !contacts.data.contacts.some((c) => {
          return c.id === d.id;
        });
      });
      setData(DATA);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = (item) => {
    setSelectedItem(item.id);
  };

  const handleSubmit = async () => {
    try {
      let selectedContact = selectedItem;
      if (isNewContact && newContact) {
        const fullName = newContact.split(' ');

        const newContactData = {
          first_name: fullName[0],
          last_name: fullName?.[1] || '',
        };

        if (fullName.length === 3) {
          newContactData.last_name = `${fullName[1]} ${fullName[2]}`;
        }

        if (fullName.length >= 4) {
          newContactData.first_name = `${fullName[0]} ${fullName[1]}`;
          newContactData.last_name = `${fullName[2]} ${fullName[3]}`;
        }

        const { data: contactInfo } = await contactService.createContact(
          newContactData
        );

        selectedContact = contactInfo.id;
      }

      await contactService.linkOrganization(selectedContact, organizationId);
      setShowAddContactModal(false);
      onHandleShowAlertSuccess(constants.messageSaveSuccess);
    } catch (error) {
      onHandleShowAlertFailed(constants.messageSaveFailed);
    }
  };

  const handleCloseAddContactModal = () => {
    setShowAddContactModal(false);
  };

  useEffect(() => {
    if (showAddContactModal) {
      searchContacts();
    } else {
      setSelectedItem(null);
      getContacts();
      setFilter('');
      setIsNewContact(false);
      setNewContact(undefined);
    }
  }, [showAddContactModal]);

  useEffect(() => {
    if (filter) {
      searchContacts();
    }
  }, [filter]);

  return (
    <>
      <SimpleModal
        onHandleCloseModal={handleCloseAddContactModal}
        open={showAddContactModal}
        modalTitle="Add Contact"
        buttonLabel={'Add Contact'}
        buttonsDisabled={!isNewContact && !selectedItem}
        handleSubmit={handleSubmit}
      >
        <DropdownSearch
          title="Add Contacts"
          name="assigned_user_id"
          search={filter}
          onChange={(e) => {
            setFilter(e?.target?.value);
          }}
          data={data}
          onHandleSelect={(item) => {
            handleSelect(item);
          }}
          createItem={(data) => {
            setNewContact(data);
            setIsNewContact(true);
          }}
        />
      </SimpleModal>
      {children}
    </>
  );
};

export default AddContact;
