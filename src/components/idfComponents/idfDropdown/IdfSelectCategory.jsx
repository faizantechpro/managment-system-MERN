import { useState, useEffect } from 'react';
import { FormGroup, Label } from 'reactstrap';

import IdfDropdownSearch from './IdfDropdownSearch';
import categoryService from '../../../services/category.service';

const IdfSelectCategory = ({
  label,
  onChange,
  value,
  noDefault,
  errorClass,
  ...restProps
}) => {
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchCategory, setSearchCategory] = useState({
    search: '',
  });

  useEffect(() => {
    if (value) {
      getCategory();
    }
  }, [value]);

  useEffect(() => {
    onGetCategories();
  }, [searchCategory.search]);

  const getCategory = async () => {
    const categoryInfo = await categoryService.GetCategoryById(value);

    setSelectedCategory(categoryInfo?.title);
  };

  const onGetCategories = async () => {
    const response = await categoryService
      .GetCategories(
        { search: searchCategory.search },
        {
          page: 1,
          limit: 1000,
        }
      )
      .catch((err) => console.log(err));

    const { data } = response || {};

    // since we changed the request, in new change it comes back in data field without any pagination object
    setCategoryData(data);
  };

  const fieldInFields = (item) => {
    onChange({
      target: {
        name: 'categoryId',
        value: item.id,
      },
    });
    setSelectedCategory(item.title);
  };

  const stateChange = (e) => {
    setSearchCategory({
      ...searchCategory,
      search: e.target.value,
    });
  };

  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <IdfDropdownSearch
        title="Search for Category"
        data={categoryData}
        customTitle="title"
        onHandleSelect={(_, item) => fieldInFields(item)}
        value={selectedCategory}
        onChange={stateChange}
        errorClass={errorClass}
        {...restProps}
      />
    </FormGroup>
  );
};

export default IdfSelectCategory;
