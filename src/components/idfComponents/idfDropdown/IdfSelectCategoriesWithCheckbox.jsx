import { useState, useEffect } from 'react';
import { FormGroup, Label } from 'reactstrap';

import IdfDropdownSearchWithCheckbox from './IdfDropdownSearchWithCheckbox';
import categoryService from '../../../services/category.service';

const IdfSelectCategory = ({
  label,
  onChange,
  value,
  noDefault,
  ...restProps
}) => {
  const { checkedList } = restProps;

  const [usersData, setUsersData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchCategory, setSearchCategory] = useState({
    search: '',
  });

  useEffect(async () => {
    const extraData = checkedList?.map((category) => category.id);

    const options = { search: searchCategory.search };

    const response = await categoryService
      .GetCategories(options, { limit: 1000, extraData })
      .catch((err) => console.log('el error', err));

    const { data } = response || {};

    setUsersData(data);
  }, [searchCategory.search, checkedList]);

  const fieldInFields = (item) => {
    onChange({
      target: {
        name: 'categoryId',
        value: item.id,
      },
    });

    setSelectedCategory(`${item.first_name} ${item.last_name}`);
  };

  const stateChange = (e) => {
    setSearchCategory({
      ...searchCategory,
      search: e.target.value,
    });
  };

  return (
    <FormGroup className="m-0 min-width-220">
      {label && <Label>{label}</Label>}
      <IdfDropdownSearchWithCheckbox
        title="Categroies"
        data={usersData}
        customTitle="title"
        onHandleSelect={(_, item) => fieldInFields(item)}
        value={selectedCategory}
        onChange={stateChange}
        noDefault
        searchItem={searchCategory}
        togglePlaceholder="Select Categories"
        internalPlacehoder="Search Category"
        {...restProps}
      />
    </FormGroup>
  );
};

export default IdfSelectCategory;
