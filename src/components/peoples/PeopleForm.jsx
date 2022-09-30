import { useEffect, useState } from 'react';
import { Form, FormGroup, Input, Label, Row, Col } from 'reactstrap';
import { Image } from 'react-bootstrap';

import organizationService from '../../services/organization.service';
import userService from '../../services/user.service';
import deleteIcon from '../../assets/svg/deleteicon.svg';
import {
  ADDITIONAL_FIELDS_LIMIT,
  ALL_LABEL,
  EMAIL_LABEL,
  EMAIL_LOCATION,
  NAME_LABEL,
  ORGANIZATION,
  OWNER,
  PHONE,
  PHONE_LOCATION,
  SEARCH_FOR_ORGANIZATION,
} from '../../utils/constants';
import {
  dataLocation,
  emailDataLocation,
} from '../../views/Deals/contacts/Contacts.constants';
import {
  onHandleSelect,
  onInputChange,
  onInputSearch,
} from '../../views/Deals/contacts/utils';
import DropdownSearch from '../DropdownSearch';
import DropdownSelect from '../DropdownSelect';
import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import IdfSelectLabel from '../idfComponents/idfDropdown/IdfSelectLabel';
import IdfOwnersHeader from '../idfComponents/idfAdditionalOwners/IdfOwnersHeader';

const PeopleForm = ({
  dispatch,
  peopleFormData,
  refresh,
  searchValue,
  ...props
}) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [selectTitle, setSelectTitle] = useState(ALL_LABEL);
  const [searchOrg, setSearchOrg] = useState({
    search: '',
  });
  const [additionalEmails, setAdditionalEmails] = useState([]);
  const [additionalPhones, setadditionalPhone] = useState([]);
  const [selectOwner, setSelectOwner] = useState('');
  const [selectedPhone, setSelectedPhone] = useState({});
  const [phoneFormat, setPhoneFormat] = useState({});

  async function onGetOrganzations() {
    const response = await organizationService
      .getOrganizations(searchOrg, { limit: 100 })
      .catch((err) => err);

    setAllOrganizations(response?.data?.organizations);
  }

  useEffect(() => {
    onGetOrganzations();
  }, [searchOrg]);

  useEffect(async () => {
    const me = await getCurrentUser().catch((err) => console.log(err));

    dispatch({
      type: 'set',
      input: 'assigned_user_id',
      payload: me?.id,
    });

    setSelectOwner(me);
  }, []);

  useEffect(async () => {
    setSelectedPhone({ [`${PHONE_LOCATION}`]: dataLocation[0] });
  }, [peopleFormData.owner]);

  const getCurrentUser = async () => {
    const user = await userService
      .getUserInfo()
      .catch((err) => console.error(err));

    return user;
  };

  const onAddField = (type, list = []) => {
    const data = {
      add_email: {
        name: 'email',
        key: EMAIL_LOCATION,
        data: additionalEmails,
        callback: setAdditionalEmails,
      },
      add_phone: {
        name: 'phone',
        key: PHONE_LOCATION,
        data: additionalPhones,
        callback: setadditionalPhone,
      },
    };

    const objectKeys = Object.keys(peopleFormData).filter((key) =>
      key.includes(data[type].key)
    );

    const newDataLocation =
      list.length > 0 ? list.slice() : dataLocation.slice();

    objectKeys.forEach((key) => {
      const value = peopleFormData[key];

      const index = newDataLocation.findIndex((loc) => loc.name === value);

      newDataLocation.splice(index, 1);
    });

    const newField = {
      [`${data[type]?.name}_${objectKeys.length + 1}`]: '',
      [`${data[type]?.name}_location_${objectKeys.length + 1}`]:
        newDataLocation[0]?.name || dataLocation[0]?.name,
    };

    setSelectedPhone({
      ...selectedPhone,
      [`${data[type]?.name}_location_${objectKeys.length + 1}`]:
        newDataLocation[0] || dataLocation[0],
    });

    const newData = data[type]?.data.slice();

    newData.push({
      name: `${data[type]?.name}_${objectKeys.length + 1}`,
      locationName: `${data[type]?.name}_location_${objectKeys.length + 1}`,
    });

    data[type]?.callback(newData);

    dispatch({
      type,
      payload: newField,
    });
  };

  const onRemoveField = (record, type) => {
    const data = {
      remove_email: {
        data: additionalEmails,
        callback: setAdditionalEmails,
      },
      remove_phone: {
        data: additionalPhones,
        callback: setadditionalPhone,
      },
    };

    const newAdditionalFields = data[type].data.filter(
      (field) => field.name !== record.name
    );

    delete peopleFormData[record.name];
    delete peopleFormData[record.locationName];

    data[type].callback(newAdditionalFields);
  };

  function phoneFormatting(e, phone) {
    if (e.target.value.length < 13) {
      const cleaned = ('' + e.target.value).replace(/\D/g, '');

      const normValue = `${cleaned.substring(0, 3)}${
        cleaned.length > 3 ? '-' : ''
      }${cleaned.substring(3, 6)}${
        cleaned.length > 6 ? '-' : ''
      }${cleaned.substring(6, 11)}`;

      setPhoneFormat({ [`${phone}`]: normValue });
    }
  }

  return (
    <Form>
      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      <Label>{NAME_LABEL}</Label>
      <FormGroup>
        <Row form>
          <Col md={6}>
            <Input
              type="text"
              name="first_name"
              id="first_name"
              onChange={(e) => onInputChange(e, dispatch)}
              placeholder="First Name"
            />
          </Col>
          <Col md={6}>
            <Input
              type="text"
              name="last_name"
              id="last_name"
              onChange={(e) => onInputChange(e, dispatch)}
              placeholder="Last Name"
            />
          </Col>
        </Row>
      </FormGroup>

      <FormGroup>
        <Label>Title</Label>
        <Input
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          value={searchValue}
          onChange={(e) => onInputChange(e, dispatch)}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="organization">{ORGANIZATION}</Label>
        <DropdownSearch
          id="organization_id"
          title={SEARCH_FOR_ORGANIZATION}
          name="organization_id"
          onChange={(e) => onInputSearch(e, searchOrg, setSearchOrg)}
          data={allOrganizations}
          onHandleSelect={(item) => {
            onHandleSelect(item, 'organization_id', dispatch, selectTitle);
            dispatch({
              type: 'set',
              input: 'contact_organization_new',
              payload: null,
            });
          }}
          customTitle="name"
          extraTitles={['address_city', 'address_state']}
          search={searchOrg.search}
          createItem={(data) => {
            dispatch({
              type: 'set',
              input: 'contact_organization_new',
              payload: data,
            });
          }}
        />
      </FormGroup>

      <FormGroup>
        <IdfSelectLabel
          type="contact"
          onChange={(item) => onHandleSelect(item, 'label_id', dispatch)}
          refresh={refresh}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="phone">{PHONE}</Label>
        <div className="input-group mb-3">
          <input
            type="text"
            name="phone"
            id="phone"
            value={phoneFormat.phone}
            className="form-control w-75 border-right-0 input-dropGroup"
            aria-label="Text input with dropdown button"
            onChange={(e) => {
              phoneFormatting(e, 'phone');
              onInputChange(e, dispatch);
            }}
          />
          <DropdownSelect
            data={dataLocation}
            customTitle="title"
            selected={selectedPhone}
            isSmall
            onHandleSelect={(item) => {
              setSelectedPhone({
                ...selectedPhone,
                [`${PHONE_LOCATION}`]: item,
              });
              onHandleSelect(item, PHONE_LOCATION, dispatch, setSelectTitle);
            }}
            select={peopleFormData.phone_location}
            group
          />
        </div>
      </FormGroup>

      {additionalPhones?.map((additionalPhone) => (
        <FormGroup key={additionalPhone}>
          <div className="input-group mb-3" style={{ width: '525px' }}>
            <input
              type="text"
              name={additionalPhone.name}
              id={additionalPhone.name}
              value={phoneFormat[additionalPhone.name]}
              className="form-control w-75 border-right-0 input-dropGroup"
              aria-label="Text input with dropdown button"
              pattern="[\d]/g"
              onChange={(e) => {
                phoneFormatting(e, additionalPhone.name);
                onInputChange(e, dispatch);
              }}
            />
            <DropdownSelect
              data={dataLocation}
              customTitle="title"
              selected={selectedPhone}
              isSmall
              onHandleSelect={(item) => {
                setSelectedPhone({
                  ...selectedPhone,
                  [`${additionalPhone.locationName}`]: item,
                });
                onHandleSelect(
                  item,
                  `${additionalPhone.locationName}`,
                  dispatch,
                  setSelectTitle
                );
              }}
              select={peopleFormData[additionalPhone.locationName]}
              group
            />
            <span
              className={`text-danger remove-additional-field `}
              onClick={() => onRemoveField(additionalPhone, 'remove_phone')}
            >
              <Image src={deleteIcon} />
            </span>
          </div>
        </FormGroup>
      ))}

      {additionalPhones.length < ADDITIONAL_FIELDS_LIMIT && (
        <div
          className="mb-4 text-primary cursor-pointer"
          onClick={() => onAddField('add_phone')}
        >
          <span className="material-icons-outlined">add</span>
          <span>{'Add Phone'}</span>
        </div>
      )}

      <FormGroup>
        <Label htmlFor="email">{EMAIL_LABEL}</Label>
        <div className="input-group input-group-sm-down-break align-items-center">
          <input
            type="text"
            name="email"
            id="email"
            className="form-control w-75 border-right-0 input-dropGroup"
            aria-label="Text input with dropdown button"
            onChange={(e) => onInputChange(e, dispatch)}
          />
          <div className="input-group-append">
            <div className="select2-custom">
              <DropdownSelect
                data={emailDataLocation}
                customTitle="title"
                isSmall
                onHandleSelect={(item) =>
                  onHandleSelect(item, EMAIL_LOCATION, dispatch, setSelectTitle)
                }
                select={peopleFormData.email_location}
                group
              />
            </div>
          </div>
        </div>
      </FormGroup>

      {additionalEmails?.map((additionalEmail) => (
        <FormGroup key={additionalEmail}>
          <div className="input-group mb-3" style={{ width: '525px' }}>
            <input
              type="text"
              name={additionalEmail.name}
              id={additionalEmail.name}
              className="form-control border-right-0 input-dropGroup"
              aria-label="Text input with dropdown button"
              onChange={(e) => onInputChange(e, dispatch)}
            />
            <DropdownSelect
              data={emailDataLocation}
              customTitle="title"
              isSmall
              onHandleSelect={(item) =>
                onHandleSelect(
                  item,
                  `${additionalEmail.locationName}`,
                  dispatch,
                  setSelectTitle
                )
              }
              select={peopleFormData[additionalEmail.locationName]}
              group
            />
            <span
              className="remove-additional-field text-danger"
              onClick={() => onRemoveField(additionalEmail, 'remove_email')}
            >
              <Image src={deleteIcon} />
            </span>
          </div>
        </FormGroup>
      ))}

      {additionalEmails.length < emailDataLocation.length - 1 && (
        <div
          className="mb-4 text-primary cursor-pointer"
          onClick={() => onAddField('add_email', emailDataLocation)}
        >
          <span className="material-icons-outlined">add</span>
          <span>{'Add Email'}</span>
        </div>
      )}

      <FormGroup>
        <Label htmlFor="assigned_user_id">{OWNER}</Label>
        <IdfOwnersHeader
          id="assigned_user_id"
          name="assigned_user_id"
          showAvatar={true}
          mainOwner={selectOwner}
          isClickable={false}
          {...props}
        />
      </FormGroup>
    </Form>
  );
};

export default PeopleForm;
