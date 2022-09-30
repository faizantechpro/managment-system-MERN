import { useState, useEffect } from 'react';
import { FormGroup, Label } from 'reactstrap';

import dealService from '../../../services/deal.service';
import IdfDropdownSearch from './IdfDropdownSearch';

const IdfSelectDeal = ({
  name,
  label,
  onChange,
  value,
  contactId,
  organizationId,
  title,
  dealSelected,
  setDealSelected,
  setDealInfo,
}) => {
  const [dealsData, setDealsData] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState('');
  const [searchDeal, setSearchDeal] = useState({
    search: '',
  });

  useEffect(() => {
    getDeals();
  }, [searchDeal.search]);

  useEffect(() => {
    if (!dealSelected && !value) {
      setSelectedDeal('');
    }
  }, [dealSelected]);

  useEffect(() => {
    if (value) {
      getDeal();
    } else {
      setSelectedDeal('');
    }
  }, [value]);

  const getDeal = async () => {
    const deal = await dealService
      .getDealById(value)
      .catch((err) => console.log(err));

    setDealInfo(deal);
    fieldInFields(deal);
  };

  const getDeals = () => {
    const dealsFilter = {};

    if (contactId) dealsFilter.contact_person_id = contactId;
    if (organizationId) dealsFilter.contact_organization_id = organizationId;

    dealService
      .getDeals(dealsFilter, { limit: 10 })
      .then(({ data }) => {
        setDealsData(data.deals);
      })
      .catch((err) => console.log(err));
  };

  const fieldInFields = (item) => {
    onChange({
      target: {
        name: name || 'contact_deal_id',
        value: item.id,
      },
    });

    setSelectedDeal(item?.name);
  };

  const stateChange = (e) => {
    setSearchDeal({
      ...searchDeal,
      search: e.target.value,
    });
  };

  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <IdfDropdownSearch
        title={title || 'Search for deal'}
        customTitle="name"
        data={dealsData}
        onHandleSelect={(_, item) => fieldInFields(item)}
        value={selectedDeal}
        onChange={stateChange}
        icon="monetization_on"
        bodyIcon
        withData={true}
      />
    </FormGroup>
  );
};

export default IdfSelectDeal;
