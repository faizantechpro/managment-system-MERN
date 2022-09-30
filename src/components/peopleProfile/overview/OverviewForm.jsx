import React, { useState, useEffect } from 'react';

import Alert from '../../Alert/Alert';
import AlertWrapper from '../../Alert/AlertWrapper';
import Inputgroup from '../Inputgroup';
import EmailInput from '../EmailInput';
import PhoneInput from '../PhoneInput';
import { validateEmails } from '../../../utils/Utils';
import contactService from '../../../services/contact.service';
import stringConstants from '../../../utils/stringConstants.json';
import { renderComponent, VIEW_CARD } from '../../peoples/constantsPeople';

const OverviewForm = ({
  overviewData,
  setEditMode,
  getProfileInfo,
  customFields,
}) => {
  const constants = stringConstants.deals.contacts.profile;
  const [errorMessage, setErrorMessage] = useState('');
  const [inputsValue, setInputsValue] = useState({
    first_name: '',
    last_name: '',
  });
  const [emails, setEmails] = useState({});
  const [phones, setPhones] = useState({});

  useEffect(() => {
    const customKeys = {};
    const { fields } = overviewData || {};

    customFields.forEach((key) => {
      const { name, id } = key;
      customKeys[name] =
        fields?.find((field) => field.field_id === id)?.value || '';
    });

    setInputsValue({ ...overviewData, ...customKeys });
  }, [overviewData, customFields]);

  const onInputChange = (e) => {
    const { value, id } = e.target;
    setInputsValue((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const emailsValidation = validateEmails(
      Object.values(emails).filter((email) => email && email !== '')
    );
    if (emailsValidation.isValid === false) {
      const invalidEmails = emailsValidation.invalidEmails.join(', ');
      setErrorMessage(`Invalid emails "${invalidEmails}"`);
    } else {
      try {
        const promises = [
          contactService.updateContact(overviewData.id, {
            ...inputsValue,
            ...emails,
            ...phones,
          }),
        ];

        customFields.forEach(({ name, id, field_type }) => {
          if (inputsValue[name]?.toString().trim() !== '') {
            promises.push(
              contactService.upsertCustomField(overviewData.id, {
                value:
                  field_type === 'NUMBER'
                    ? Number(inputsValue[name])
                    : inputsValue[name],
                field_id: id,
              })
            );
          }
        });

        await Promise.all(promises);
        setEditMode(VIEW_CARD);
        getProfileInfo(constants.contactUpdated);
      } catch (error) {
        getProfileInfo(constants.errorContactUpdated);
      }
    }
  };

  return (
    <div className="card-body bg-light">
      <AlertWrapper>
        <Alert
          message={errorMessage}
          setMessage={setErrorMessage}
          color="danger"
        />
      </AlertWrapper>
      <Inputgroup
        name="first_name"
        label="First name"
        value={inputsValue.first_name}
        onChange={onInputChange}
        required
      />
      <Inputgroup
        name="last_name"
        label="Last name"
        value={inputsValue.last_name}
        onChange={onInputChange}
        required
      />

      <PhoneInput data={inputsValue} setInputs={setPhones} />
      <EmailInput data={inputsValue} setInputs={setEmails} />

      {customFields?.map((field) => {
        const { field_type, name } = field;

        return React.cloneElement(renderComponent(field_type), {
          value: inputsValue,
          onChange: onInputChange,
          name: name,
          label: name,
          key: name,
          placeholder: name,
          format: ['TIME'].includes(field_type)
            ? 'YYYY-MM-DD hh:mm:ss A'
            : null,
          type: field_type === 'NUMBER' ? 'number' : null,
        });
      })}

      <div className="text-right">
        <button
          className="btn btn-white mr-2"
          onClick={() => {
            setEditMode(VIEW_CARD);
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default OverviewForm;
