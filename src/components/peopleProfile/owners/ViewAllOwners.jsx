import { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import contactService from '../../../services/contact.service';
import Pagination from '../../Pagination';
import ContactOwnerList from './ContactOwnerList';

const ViewAllOwners = ({
  openAllOwners,
  setOpenAllOwners,
  count,
  mainOwner,
  onRemove,
  id,
}) => {
  const [owners, setOwners] = useState([]);
  const [newContactOwners, setNewContactOwners] = useState([]);
  const [excludeOwner, setExcludeOwner] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: Math.ceil(count / 5),
    limit: 5,
  });

  useEffect(() => {
    setPagination({
      page: 1,
      totalPages: Math.ceil(count / 5),
      limit: 5,
    });
  }, [count]);

  useEffect(async () => {
    const resp = await await contactService
      .getOwners(id, pagination)
      .catch((err) => console.log(err));

    const { data } = resp || {};

    setOwners(data);
  }, [pagination]);

  useEffect(() => {
    if (pagination.totalPages > 1) {
      if (pagination.page === 1) {
        setExcludeOwner(owners[4]);
        const newContactOwners = owners?.slice(0, 4);

        const newContactList = [
          { user_id: mainOwner?.id, user: mainOwner },
          ...newContactOwners,
        ];

        return setNewContactOwners(newContactList);
      }

      if (pagination.page === pagination.totalPages) {
        const newContactList = [excludeOwner, ...owners];
        return setNewContactOwners(newContactList);
      }
    }

    return setNewContactOwners(owners);
  }, [owners]);

  const changePage = (newPage) => {
    if (newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const close = (
    <button
      className="close"
      style={{ fontSize: '30px' }}
      onClick={() => {
        setOpenAllOwners(false);
      }}
    >
      &times;
    </button>
  );

  return (
    <>
      <Modal isOpen={openAllOwners} fade={false}>
        <ModalHeader tag="h2" close={close}>
          Assigned Owners
        </ModalHeader>
        <ModalBody>
          <div className="list-group list-group-lg list-group-flush list-group-no-gutters">
            {newContactOwners.length === 0 && <div>No Owners yet</div>}
            {newContactOwners.map((item) => (
              <ContactOwnerList
                key={`${item.user_id}${
                  item.organization_id ? `-${item.organization_id}` : ''
                }`}
                item={item}
                handleRemove={() => onRemove(item)}
              />
            ))}
            <Pagination paginationInfo={pagination} onPageChange={changePage} />
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ViewAllOwners;
