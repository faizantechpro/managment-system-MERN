import { useState, useEffect } from 'react';
import { FormGroup, Label } from 'reactstrap';

import organizationService from '../../../services/organization.service';
import IdfDropdownSearch from './IdfDropdownSearch';

const IdfSelectOrganization = ({
  name,
  label,
  onChange,
  value,
  title,
  contactInfo,
  dealInfo,
  setOrganizationSelected,
  organizationSelected,
  feedInfo,
}) => {
  const [organizationsData, setOrganizationsData] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [searchOrganization, setSearchOrganization] = useState({
    search: '',
  });

  useEffect(() => {
    if (dealInfo && !organizationSelected) {
      setSelectedOrganization(dealInfo?.organization?.name);
      setOrganizationSelected(dealInfo?.organization);
    }
  }, [dealInfo]);

  useEffect(() => {
    if (contactInfo) {
      setSelectedOrganization(contactInfo?.organization?.name);
      setOrganizationSelected(contactInfo?.organization);
    }
  }, [contactInfo]);

  useEffect(() => {
    onGetOrganzations();
  }, [searchOrganization.search]);

  useEffect(() => {
    if (value) {
      fieldInFields(value);
    } else {
      setSelectedOrganization('');
    }
  }, [value]);

  const fieldInFields = (item) => {
    onChange({
      target: {
        name: name || 'contact_organization_id',
        value: item.id,
      },
    });

    setSelectedOrganization(item.name);
  };

  async function onGetOrganzations() {
    const response = await organizationService
      .getOrganizations(searchOrganization, { limit: 10 })
      .catch((err) => err);

    setOrganizationsData(response?.data?.organizations);
  }

  const stateChange = (e) => {
    setSearchOrganization({
      ...searchOrganization,
      search: e.target.value,
    });
  };

  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <IdfDropdownSearch
        title={title || 'Search for Organization'}
        customTitle="name"
        data={organizationsData}
        onHandleSelect={(_, item) => fieldInFields(item)}
        value={selectedOrganization}
        onChange={stateChange}
        icon="corporate_fare"
        bodyIcon
        extraTitles={['address_street', 'address_city', 'address_state']}
      />
    </FormGroup>
  );
};

export default IdfSelectOrganization;
