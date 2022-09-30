import { Col, Form, Dropdown, Row } from 'react-bootstrap';

import { tagsColorNormal } from '../../../views/Deals/contacts/Contacts.constants';
import Avatar from '../../Avatar';
import Item from '../../Item';
import ItemAvatar from '../../ItemAvatar';
import ItemName from '../../ItemName';
import List from '../../List';
import ButtonIcon from '../../commons/ButtonIcon';

const IdfDropdownSearchWithCheckbox = (props) => {
  const {
    id,
    data,
    customTitle,
    onHandleSelect,
    value,
    onChange,
    showAvatar,
    bulletPoints,
    checkedList,
    setCheckedList,
    searchItem,
    applyFilter,
    icon,
    togglePlaceholder,
    internalPlaceholder,
    placeholderToggleSelect,
  } = props;

  const selectedText = value && 'text-black';

  const renderName = (item) => {
    const checked = checkedList?.find((owner) => owner.id === item.id) || false;

    return (
      <div className="d-flex justify-content-between custom-control custom-checkbox">
        <span>
          {customTitle
            ? item[customTitle]
            : `${item.first_name} ${item.last_name}`}
        </span>
        <Form.Check type="checkbox" checked={checked} readOnly />
      </div>
    );
  };

  const onSelect = (e, item) => {
    onHandleSelect(e, item);
    const checked = checkedList?.find((owner) => owner.id === item.id);

    if (checked && checkedList.length < 2) {
      return null;
    } else if (checked && checkedList.length > 4) {
      return null;
    } else if (checked)
      setCheckedList(checkedList?.filter((owner) => owner.id !== item.id));
  };

  const ItemInfo = ({ item }) => (
    <Item
      id={`item-${item.id}`}
      key={`item-${item.id || item.name}`}
      onClick={(e) => onSelect(e, item)}
      className="w-100"
    >
      <Row className="user-avatar-select w-100 min-width-200" noGutters>
        {bulletPoints && (
          <div
            className={`ml-3 rounded-circle bullet-color`}
            style={{
              background: tagsColorNormal[item.name],
            }}
          />
        )}
        {showAvatar && (
          <ItemAvatar>
            <Avatar user={item} />
          </ItemAvatar>
        )}

        <ItemName name={renderName(item)} />
      </Row>
    </Item>
  );

  const checkingCheckedList = () =>
    checkedList?.map((item) => <ItemInfo key={item.id} item={item} />);

  const applyFilterData = () => {
    applyFilter();

    const dropdownMenu = document.getElementById(id);
    dropdownMenu.classList.remove('show');
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        className={`w-100 dropdown-search ${selectedText || ''}`}
        variant="outline-link"
      >
        {!placeholderToggleSelect && (
          <span>
            {icon && <span className="material-icons-outlined">{icon}</span>}
            {togglePlaceholder}
          </span>
        )}

        {placeholderToggleSelect && checkedList?.length === 0 && (
          <span>
            {icon && <span className="material-icons-outlined">{icon}</span>}
            {togglePlaceholder}
          </span>
        )}

        {placeholderToggleSelect && checkedList?.length === 1 && (
          <div className="w-100 d-flex align-items-center">
            <ItemAvatar className="p-0">
              <Avatar user={checkedList[0]} defaultSize="xsm" />
            </ItemAvatar>
            <span className="w-80 fw-bold">
              {checkedList[0].first_name} {checkedList[0]?.last_name}
            </span>
          </div>
        )}

        {placeholderToggleSelect && checkedList?.length > 1 && (
          <span className="fw-bold">{checkedList?.length} items select</span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu id={id} className="border border-1 overflow-auto w-100">
        <Col xs={12}>
          <Form.Control
            type="text"
            onChange={onChange}
            onClick={(e) => e.stopPropagation()}
            value={searchItem.search}
            placeholder={internalPlaceholder}
          />
        </Col>

        <List className="dropdown-results">
          {checkingCheckedList()}

          <div className="border-top" />

          {data?.map((item) => (
            <ItemInfo key={item.id} item={item} />
          ))}
        </List>

        {applyFilter && (
          <div className="d-flex justify-content-end col-12">
            <ButtonIcon
              label="Apply"
              classnames="w-100"
              onclick={applyFilterData}
            />
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default IdfDropdownSearchWithCheckbox;
