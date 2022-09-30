import React, { useEffect, useState } from 'react';

import Inputgroup from '../../peopleProfile/Inputgroup';
import organizationService from '../../../services/organization.service';
import { EMPLOYEES_VALUES } from './OrganizationsConstants';
import stringConstants from '../../../utils/stringConstants.json';
import DropdownSearch from '../../DropdownSearch';
import usaStates from '../../organizations/Constants.states.json';
import { onInputSearch } from '../../../views/Deals/contacts/utils';

const constants = stringConstants.deals.organizations.profile;
const OrganizationForm = ({
  data,
  setEditMode,
  getProfileInfo,
  setSuccessMessage,
  setErrorMessage,
}) => {
  const [searchState, setSearchState] = useState({
    search: '',
  });
  const [inputsValue, setInputsValue] = useState({
    name: '',
    status: '',
    address_city: '',
    address_country: '',
    address_postalcode: '',
    address_street: '',
    address_suite: '',
    address_state: '',
    industry: '',
    sic_code: '',
    naics_code: '',
    employees: '1-10',
    annual_revenue_merchant: '',
    annual_revenue_treasury: '',
    annual_revenue_business_card: '',
    total_revenue: '',
    cif: '',
    branch: '',
  });

  useEffect(() => {
    const editData = {
      name: data.name || '',
      status: data.status || '',
      address_city: data.address_city || '',
      address_country: data.address_country || '',
      address_postalcode: data.address_postalcode || '',
      address_street: data.address_street || '',
      address_suite: data.address_suite || '',
      address_state: data.address_state || '',
      industry: data.industry || '',
      sic_code: data.sic_code || '',
      naics_code: data.naics_code || '',
      employees: data.employees || '1-10',
      annual_revenue_merchant: data.annual_revenue_merchant || '',
      annual_revenue_treasury: data.annual_revenue_treasury || '',
      annual_revenue_business_card: data.annual_revenue_business_card || '',
      total_revenue: data.total_revenue || '',
      cif: data.cif || '',
      branch: data.branch || '',
    };
    setInputsValue(editData);
  }, [data]);

  const onInputChange = (e) => {
    const { value, id } = e.target;
    setInputsValue((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    organizationService
      .updateOrganization(data.id, inputsValue)
      .then(() => {
        setSuccessMessage(constants.profileForm.updated);
        setEditMode(false);
        getProfileInfo();
      })
      .catch(() => {
        setErrorMessage(constants.profileForm.updateError);
      });
  };

  const filteredData = usaStates.filter((state) =>
    state.name.toLowerCase().includes(searchState.search.toLowerCase())
  );

  return (
    <div className="card-body">
      <Inputgroup
        name="name"
        value={inputsValue.name}
        onChange={onInputChange}
        label="Name"
        required
      />
      <Inputgroup
        name="address_street"
        value={inputsValue.address_street}
        onChange={onInputChange}
        label="Street Address"
        required
      />
      <Inputgroup
        name="address_suite"
        value={inputsValue.address_suite}
        onChange={onInputChange}
        label="Suite or P.O. Box"
      />
      <Inputgroup
        name="address_city"
        value={inputsValue.address_city}
        onChange={onInputChange}
        label="City"
        required
      />
      <div className="form-group mb-3">
        <label htmlFor="address_state">State</label>
        <DropdownSearch
          id="address_state"
          title="Search for state"
          name="address_state"
          showAvatar={false}
          customTitle="name"
          customMenuClassName="dropdown-select-custom"
          onChange={(e) => onInputSearch(e, searchState, setSearchState)}
          data={filteredData}
          onHandleSelect={(value) =>
            setInputsValue({
              ...inputsValue,
              address_state: value.name,
            })
          }
          selected={inputsValue.address_state}
        />
      </div>

      <Inputgroup
        name="address_postalcode"
        value={inputsValue.address_postalcode}
        onChange={onInputChange}
        label="Zip Code"
        required
      />
      <Inputgroup
        name="industry"
        value={inputsValue.industry}
        onChange={onInputChange}
        label="Industry"
      />
      <Inputgroup
        name="sic_code"
        value={inputsValue.sic_code}
        onChange={onInputChange}
        label="SIC Code"
      />
      <Inputgroup
        name="naics_code"
        value={inputsValue.naics_code}
        onChange={onInputChange}
        label="NAICS"
      />
      <Inputgroup
        name="cif"
        value={inputsValue.cif}
        onChange={onInputChange}
        label="CIF"
      />
      <div className="form-group mb-3">
        <label htmlFor="employees">Employees</label>
        <select
          className="custom-select"
          id="employees"
          name="employees"
          value={inputsValue.employees}
          onChange={onInputChange}
        >
          {EMPLOYEES_VALUES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <Inputgroup
        type="number"
        name="total_revenue"
        value={inputsValue.total_revenue}
        onChange={onInputChange}
        label={stringConstants.deals.contacts.profile.totalRevenue}
      />

      <div className="text-right">
        <button
          className="btn btn-white mr-2"
          onClick={() => {
            setEditMode(false);
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

export default OrganizationForm;
