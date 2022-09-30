import { useEffect, useState } from 'react';
import { FormGroup, Label } from 'reactstrap';
import searchService from '../../../services/search.service';

import IdfDropdownSearch from './IdfDropdownSearch';

const correctField = {
  organization: {
    id: 'organization_id',
    title: 'organization_name',
    icon: 'corporate_fare',
  },
  contact: {
    id: 'contact_id',
    title: 'contact_name',
    icon: 'person',
  },
  deal: {
    id: 'deal_id',
    title: 'deal_name',
    icon: 'monetization_on',
  },
};

const IdfSelectMultiOpp = ({
  label,
  onChange,
  value,
  noDefault,
  ...restProps
}) => {
  const [multiData, setMultiData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [searchItem, setSearchItem] = useState({
    search: '',
  });

  useEffect(() => {
    termFinder();
  }, [searchItem.search]);

  const termFinder = () => {
    searchService
      .getSearchResults({ s: searchItem.search })
      .then((response) => setMultiData(response?.data))
      .catch((err) => console.log(err));
  };

  const fieldInFields = (item) => {
    onChange({
      target: {
        name: item.sectionId,
        value: item.id,
      },
    });

    setSelectedItem(item.title);
  };

  const stateChange = (e) => {
    setSearchItem({
      ...searchItem,
      search: e.target.value,
    });
  };

  const compare = (itemA, itemB) => {
    if (itemA.kind < itemB.kind) {
      return -1;
    }
    if (itemA.kind > itemB.kind) {
      return 1;
    }
    return 0;
  };

  const renderData = () => {
    const newMultiData = [];

    multiData?.forEach((item) => {
      if (item.kind in correctField && item[correctField[item.kind].title]) {
        newMultiData.push({
          id: item[correctField[item.kind].id] || '',
          kind: item.kind,
          sectionId: correctField[item.kind].id,
          title:
            Boolean(item[correctField[item.kind].title]) &&
            `${item[correctField[item.kind].title] || ''}`,
          icon: correctField[item.kind].icon,
        });
      }
    });

    return newMultiData.sort(compare);
  };

  return (
    <FormGroup>
      <Label>{label}</Label>
      <IdfDropdownSearch
        title="Search for contact, organization or deal"
        data={renderData()}
        customTitle="title"
        onHandleSelect={(_, item) => fieldInFields(item)}
        value={selectedItem}
        onChange={stateChange}
        showIcon
        {...restProps}
      />
    </FormGroup>
  );
};

export default IdfSelectMultiOpp;
