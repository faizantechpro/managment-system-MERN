import { useRef, useState } from 'react';
import SearchFilter from './SearchFilter';
import useOutsideClick from '../hooks/useOutsideClick';
import { ALL_LABEL } from '../utils/constants';

const FilterSelect = ({
  filterItem,
  dispatch,
  callbackService,
  callbackRequest,
  callbackResponseData,
  customTitle,
  searchPlaceholder,
  customKey,
  onItemSelect,
  showAvatar,
}) => {
  const SearchDrop = useRef(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [selectTitle, setSelectTitle] = useState(ALL_LABEL);

  const toogleSearch = () => setSearchOpen((prevState) => !prevState);

  const toogleSearchClassName = searchOpen ? '' : 'hs-unfold-hidden';

  const onHandleSelect = (item, e) => {
    if (item === ALL_LABEL.toLocaleLowerCase()) {
      setSelectTitle(ALL_LABEL);

      return dispatch({
        type: 'remove',
        input: filterItem.name,
      });
    }

    setSelectTitle(item.title || `${item.first_name} ${item.last_name}`);

    dispatch({
      type: 'set',
      input: filterItem.name,
      payload: !customKey ? item.name || item.id : item,
      fullPayLoad: item,
    });

    onItemSelect && onItemSelect(item);

    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
  };

  useOutsideClick(SearchDrop, setSearchOpen);

  return (
    <div className="mb-4">
      <small className="text-cap mb-2" data-uw-styling-context="true">
        {filterItem.label}
      </small>

      <SearchFilter
        {...filterItem}
        toogleSearch={toogleSearch}
        toogleSearchClassName={toogleSearchClassName}
        options={filterItem.options}
        filterSelected={selectTitle}
        onHandleSelect={onHandleSelect}
        callbackService={callbackService}
        callbackRequest={callbackRequest}
        callbackResponseData={callbackResponseData}
        customTitle={customTitle}
        searchPlaceholder={searchPlaceholder}
        showAvatar={showAvatar}
      />
    </div>
  );
};

export default FilterSelect;
