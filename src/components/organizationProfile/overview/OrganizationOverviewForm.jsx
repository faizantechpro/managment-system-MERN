import React, { useEffect, useReducer, useState } from 'react';

import { reducer } from '../../../views/Deals/contacts/utils';
import { initialOrgForm } from '../../../views/Deals/contacts/Contacts.constants';
import organizationService from '../../../services/organization.service';
import stringConstants from '../../../utils/stringConstants.json';
import { organizationFormFieldsOverview } from '../../organizations/organizationFormsFields';
import OrganizationForm from '../../organizations/OrganizationForm';
import { renderComponent, VIEW_CARD } from '../../peoples/constantsPeople';

const constants = stringConstants.deals.organizations.profile;
const OrganizationOverviewForm = ({
  data,
  setEditMode,
  getProfileInfo,
  setSuccessMessage,
  setErrorMessage,
  customFields,
  updateLabel,
}) => {
  const [orgFormData, dispatchFormData] = useReducer(reducer, initialOrgForm);
  const [organizationFields, setOrganizationFields] = useState(
    organizationFormFieldsOverview
  );

  useEffect(() => {
    const customKeys = {};
    const { fields } = data;

    customFields.forEach((key) => {
      const { name, id } = key;
      customKeys[name] =
        fields.find((field) => field.field_id === id)?.value || '';
    });

    const newData = { ...data, ...customKeys };

    dispatchFormData({
      type: 'load',
      payload: { ...newData },
    });
  }, [data]);

  useEffect(() => {
    if (customFields) {
      const fields = customFields.map(({ id, name, field_type }) => ({
        id,
        name,
        label: name,
        placeholder: name,
        format: ['TIME'].includes(field_type) ? 'YYYY-MM-DD hh:mm:ss A' : null,
        max: field_type === 'NUMBER' ? 2147483645 : '',
        type: field_type === 'NUMBER' ? 'number' : null,
        component: renderComponent(field_type),
        colSize: 12,
      }));

      setOrganizationFields([...organizationFields, ...fields]);
    }
  }, []);

  const handleSubmit = async () => {
    const kipFields = [
      'name',
      'status',
      'address_city',
      'address_country',
      'address_postalcode',
      'address_street',
      'address_suite',
      'address_state',
      'phone_office',
      'industry',
      'sic_code',
      'naics_code',
      'employees',
      'annual_revenue_merchant',
      'annual_revenue_treasury',
      'annual_revenue_business_card',
      'annual_revenue',
      'cif',
      'label_id',
    ];

    const cloneOrgFormData = Object.assign({}, orgFormData);

    Object.keys(cloneOrgFormData).forEach((value) => {
      if (!kipFields.includes(value)) {
        delete cloneOrgFormData[value];
      }

      if (kipFields.includes(value) && cloneOrgFormData[value] === null) {
        cloneOrgFormData[value] = null;
      }
    });

    const promises = [];
    customFields.forEach(({ name, id, field_type }) => {
      if (orgFormData[name]?.toString().trim() !== '') {
        promises.push(
          organizationService.upsertCustomFieldOrganization(data.id, {
            value:
              field_type === 'NUMBER'
                ? Number(orgFormData[name])
                : orgFormData[name],
            field_id: id,
          })
        );
      }
    });

    Promise.all([
      organizationService.updateOrganization(data.id, cloneOrgFormData),
      ...promises,
    ])
      .then(() => {
        setSuccessMessage(constants.profileForm.updated);
        setEditMode(VIEW_CARD);
        getProfileInfo();
      })
      .catch(() => {
        setErrorMessage(constants.profileForm.updateError);
      });
  };

  return (
    <div className="card-body bg-light">
      <OrganizationForm
        dispatch={dispatchFormData}
        orgFormData={orgFormData}
        fields={organizationFields}
        refresh={updateLabel}
      />
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

export default OrganizationOverviewForm;
