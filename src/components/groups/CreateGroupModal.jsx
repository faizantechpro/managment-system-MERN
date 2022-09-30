import React, { useState } from 'react';
import { Input } from 'reactstrap';

import SimpleModal from '../modal/SimpleModal';
import stringConstants from '../../utils/stringConstants.json';
import IdfDropdownSearch from '../idfComponents/idfDropdown/IdfDropdownSearch';
import { isAlphanumeric } from '../../utils/Utils';

const errorAlphanumeric = stringConstants.settings.users.filters.alphanumeric;

const CreateGroupModal = ({
  setErrorMessage,
  showModal,
  setShowModal,
  createGroup,
  data = [],
  onChangeDrop,
}) => {
  const constants = stringConstants.settings.groups;
  const [groupName, setGroupName] = useState('');
  const [parentGroup, setParentGroup] = useState(null);

  const alphanumericError = (input) => {
    const msgError = errorAlphanumeric.error;
    if (input === 'search') {
      setErrorMessage(msgError);
      setTimeout(() => setErrorMessage(''), 3500);
    }
  };

  const onInputSearch = (e) => {
    const { value } = e.target || {};
    isAlphanumeric(value) ? setGroupName(value) : alphanumericError(`search`);
  };

  // Handler of submit
  const handleSubmit = () => {
    createGroup(groupName, parentGroup);
    setGroupName('');
    setParentGroup(null);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setGroupName('');
    setParentGroup(null);
  };

  return (
    <SimpleModal
      modalTitle={constants.create.addGroupModalTitle}
      onHandleCloseModal={() => closeModal()}
      open={showModal}
      buttonLabel={constants.create.btnAddGroup}
      buttonsDisabled={!groupName}
      handleSubmit={() => handleSubmit()}
      allowCloseOutside={false}
    >
      <span className="font-size-sm">{constants.create.textGroupName}</span>
      <Input
        data-testid="group_name"
        type="text"
        name="group_name"
        id="group_name"
        className="mt-2 mb-2"
        onChange={(e) => onInputSearch(e)}
        value={groupName}
        placeholder={constants.create.placeholderInpNewGroup}
      />
      <span className="font-size-sm">{constants.create.textParentGroup}</span>
      <IdfDropdownSearch
        id="assigned_parent"
        className="mt-2"
        title={constants.create.dropTextParentGroup}
        name="assigned_parent"
        showAvatar={false}
        customTitle={'name'}
        onChange={onChangeDrop}
        data={data}
        value={parentGroup?.name}
        onHandleSelect={(e, item) => setParentGroup(item)}
      />
    </SimpleModal>
  );
};

export default CreateGroupModal;
