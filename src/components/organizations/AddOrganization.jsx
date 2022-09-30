import { useReducer, useState, useEffect } from 'react';
import Mousetrap from 'mousetrap';
import { useHistory } from 'react-router-dom';

import organizationService from '../../services/organization.service';
import {
  ADD_ORGANIZATION,
  EMPTY_ORG_NAME,
  ORGANIZATION_CREATED,
} from '../../utils/constants';
import { initialOrgForm } from '../../views/Deals/contacts/Contacts.constants';
import { onHandleCloseModal, reducer } from '../../views/Deals/contacts/utils';
import SimpleModalCreation from '../modal/SimpleModalCreation';
import OrganizationForm from './OrganizationForm';
import { organizationFormFields } from './organizationFormsFields';
import { splitAddress } from '../../utils/Utils';

const AddOrganization = ({
  children,
  openOrganization,
  setOpenOrganization,
  successMessage,
  setSuccessMessage,
  errorMessage,
  setErrorMessage,
  getOrganizations,
  fromNavbar,
  setOpenList,
  searchValue,
  me,
}) => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [preOwners, setPreOwners] = useState([]);

  const [orgFormData, dispatchFormData] = useReducer(reducer, initialOrgForm);

  Mousetrap.bind(`shift+o`, () => setOpenOrganization(true));

  useEffect(async () => {
    if (me)
      dispatchFormData({
        type: 'set',
        input: 'assigned_user_id',
        payload: me?.id,
      });
  }, []);

  useEffect(() => {
    if (searchValue) {
      orgFormData.name = searchValue;
    }
  }, [searchValue]);

  const toggle = () => {
    setOpenOrganization(!openOrganization);
    setOpenList(false);
  };

  const onClose = () => {
    onHandleCloseModal(dispatchFormData, toggle, 'reset-Form');
  };

  const onHandleSubmit = async () => {
    setLoading(true);

    if (!orgFormData.name) {
      setLoading(false);

      return setErrorMessage(EMPTY_ORG_NAME);
    }

    // set US as country for now
    orgFormData.address_country = 'USA';

    // here splitting address back to what API needs
    orgFormData.address_street = orgFormData?.address_full
      ? splitAddress(orgFormData.address_full)?.address
      : '';

    const newContact = await organizationService
      .createOrganization(orgFormData)
      .catch((err) => console.log(err));

    if (newContact) {
      await Promise.all(
        preOwners?.map(async (item) => {
          await new Promise((resolve) => {
            organizationService
              .addOwner(newContact?.data?.id, item.user_id)
              .then(resolve);
          });
        })
      );

      getOrganizations && getOrganizations();

      dispatchFormData({
        type: 'reset-orgForm',
      });

      setPreOwners([]);

      setSuccessMessage(ORGANIZATION_CREATED);

      toggle();

      if (fromNavbar) {
        history.push(`/contacts/${newContact?.data?.id}/organization/profile`);
      }
    }

    setLoading(false);
  };

  return (
    <>
      {children}
      <SimpleModalCreation
        modalTitle={ADD_ORGANIZATION}
        open={openOrganization}
        toggle={onClose}
        handleSubmit={onHandleSubmit}
        onHandleCloseModal={() =>
          onHandleCloseModal(dispatchFormData, toggle, 'reset-orgForm')
        }
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        isLoading={loading}
        onClick={() => document.dispatchEvent(new MouseEvent('click'))}
      >
        <OrganizationForm
          dispatch={dispatchFormData}
          orgFormData={orgFormData}
          fields={organizationFormFields}
          me={me}
          isprincipalowner="true"
          service={organizationService}
          prevalue="true"
          preowners={preOwners}
          setPreOwners={setPreOwners}
          fromNavBar
        />
      </SimpleModalCreation>
    </>
  );
};

export default AddOrganization;
