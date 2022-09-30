import { useEffect, useReducer, useState } from 'react';
import { Form, FormGroup, Label } from 'reactstrap';

import DropdownSearch from '../../../components/DropdownSearch';
import contactService from '../../../services/contact.service';
import {
  ALL_LABEL,
  CANCEL_LABEL,
  CONTACT_PERSON,
  SAVE_LABEL,
  SEARCH_FOR_CONTACT,
} from '../../../utils/constants';
import { onHandleSelect, onInputSearch, reducer } from '../contacts/utils';

const PipelineOrganizationForm = ({
  setEditMode,
  onHandleSubmit,
  organizationId,
  dealId,
}) => {
  const [allContacts, setAllContact] = useState([]);
  const [selectTitle, setSelectTitle] = useState(ALL_LABEL);

  const [searchContact, setSearchContact] = useState({
    search: '',
  });

  const [dealFormData, dispatch] = useReducer(reducer, {});

  async function onGetContacts() {
    const response = await contactService
      .getContact(
        {
          organization_id: organizationId || 'not_null',
          search: searchContact.search,
        },
        { limit: 10 }
      )
      .catch((err) => err);

    setAllContact(response?.data?.contacts);
  }

  useEffect(() => {
    onGetContacts();
  }, [searchContact]);

  const onSubmit = async () => {
    onHandleSubmit(dealFormData);
  };

  return (
    <Form className="card-body bg-light">
      <FormGroup>
        <Label htmlFor="contact_person_id">{CONTACT_PERSON}</Label>
        <DropdownSearch
          id="contact_person_id"
          title={SEARCH_FOR_CONTACT}
          name="contact_person_id"
          onChange={(e) => onInputSearch(e, searchContact, setSearchContact)}
          data={allContacts}
          onHandleSelect={(item) => {
            onHandleSelect(item, 'contact_person_id', dispatch, setSelectTitle);
            onHandleSelect(item, 'organization_id', dispatch, setSelectTitle);
          }}
          selected={selectTitle}
        />
      </FormGroup>

      <div className="text-right">
        <button
          className="btn btn-white mr-2"
          onClick={() => {
            setEditMode(false);
          }}
        >
          {CANCEL_LABEL}
        </button>
        <button type="button" className="btn btn-primary" onClick={onSubmit}>
          {SAVE_LABEL}
        </button>
      </div>
    </Form>
  );
};

export default PipelineOrganizationForm;
