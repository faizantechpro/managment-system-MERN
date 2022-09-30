import { useEffect, useState, useReducer } from 'react';
import { find } from 'lodash';

import {
  onGetOwners,
  onHandleSelect,
  onInputSearch,
  reducer,
} from '../../../views/Deals/contacts/utils';
import DropdownSearch from '../../DropdownSearch';
import SimpleModal from '../../modal/SimpleModal';

const AddOwner = ({
  id,
  openModal,
  setOpenModal,
  contactOwners,
  mainOwner,
  setErrorMessage,
  setSuccessMessage,
  ownerService,
  onGetContactOwners,
  services,
}) => {
  const [data, setData] = useState([]);
  const [selectOwner, setSelectOwner] = useState('');
  const [filter, setFilter] = useState({
    search: '',
    users: [],
  });
  const [formData, dispatch] = useReducer(reducer, {});

  useEffect(async () => {
    const ownerSelected = find(data, { id: formData.assigned_user_id });

    if (ownerSelected) {
      setSelectOwner(
        `${ownerSelected?.first_name} ${ownerSelected?.last_name}`
      );
    }
  }, [formData.owner]);

  useEffect(() => {
    onGetOwners(filter, setData, contactOwners, mainOwner);
  }, [filter]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async () => {
    if (formData?.assigned_user_id === mainOwner?.id)
      return setErrorMessage(
        `${mainOwner.first_name} ${mainOwner.last_name} is already added as principal owner`
      );

    const newOwner = await services[ownerService]
      .addOwner(id, formData.assigned_user_id)
      .catch((err) => setErrorMessage(err));

    if (newOwner?.data?.message) return setErrorMessage(newOwner?.data.message);
    if (newOwner?.user_id) {
      onGetContactOwners();
      handleCloseModal();
      const ownerSelected = find(data, { id: newOwner.user_id });
      setSuccessMessage(
        `${ownerSelected?.first_name} ${ownerSelected?.last_name} added as additional owner`
      );
      setFilter('');
    }
  };

  return (
    <SimpleModal
      onHandleCloseModal={handleCloseModal}
      toggle={handleCloseModal}
      open={openModal}
      buttonLabel={'Add Owner'}
      buttonsDisabled={!formData.assigned_user_id}
      handleSubmit={handleSubmit}
      onClick={() => document.dispatchEvent(new MouseEvent('click'))}
      close={
        <button className="close" onClick={handleCloseModal}>
          ×
        </button>
      }
    >
      <DropdownSearch
        id="assigned_user_id"
        title="Search for owner"
        name="assigned_user_id"
        onChange={(e) => onInputSearch(e, filter, setFilter)}
        data={data}
        onHandleSelect={(item) =>
          onHandleSelect(item, 'assigned_user_id', dispatch)
        }
        selected={selectOwner}
      />
    </SimpleModal>
  );
};

export default AddOwner;
