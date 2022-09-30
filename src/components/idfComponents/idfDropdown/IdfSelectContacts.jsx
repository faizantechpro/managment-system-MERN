import { useState, useEffect } from 'react';
import { FormGroup, Label } from 'reactstrap';

import contactService from '../../../services/contact.service';
import IdfDropdownSearch from './IdfDropdownSearch';

const IdfSelectContact = ({
  name,
  label,
  onChange,
  value,
  title,
  profileInfo,
  dealInfo,
  fromActivity,
  personSelected,
  feedInfo,
  contact_id,
  ...restProps
}) => {
  const [contactsData, setContactsData] = useState([]);
  const [selectedContact, setSelectedContact] = useState('');
  const [searchContact, setSearchContact] = useState({
    search: '',
  });

  useEffect(() => {
    async function getContact() {
      const contactInfo = await contactService.getContactById(contact_id);
      const contactData = await contactInfo;
      setSelectedContact(
        contactData ? `${contactData.first_name} ${contactData.last_name}` : ''
      );
    }
    getContact();
  }, []);

  useEffect(() => {
    onGetContacts();
  }, [searchContact.search]);

  useEffect(() => {
    if (value) {
      fieldInFields(value);
    }
  }, [value]);

  useEffect(() => {
    if (!personSelected && !value && !dealInfo) {
      setSelectedContact('');
    }
  }, [personSelected]);

  const fieldInFields = (item) => {
    onChange({
      target: {
        name: name || 'contact_person_id',
        value: item.id,
      },
    });

    setSelectedContact(`${item.first_name} ${item.last_name}`);
  };

  async function onGetContacts() {
    const response = await contactService
      .getContact(searchContact, { limit: 10 })
      .catch((err) => err);

    setContactsData(response?.data?.contacts);
  }

  const stateChange = (e) => {
    setSearchContact({
      ...searchContact,
      search: e.target.value,
    });
  };

  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <IdfDropdownSearch
        title={title || 'Search for Contact'}
        data={contactsData}
        onHandleSelect={(_, item) => fieldInFields(item)}
        value={selectedContact || ''}
        onChange={stateChange}
        icon="people_outline"
        {...restProps}
      />
    </FormGroup>
  );
};

export default IdfSelectContact;
