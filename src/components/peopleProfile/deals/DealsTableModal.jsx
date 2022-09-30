import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import DealsTable from '../../deals/DealTableModal';
import dealService from '../../../services/deal.service';

const DealsTableModal = ({
  showModal,
  setShowModal,
  contactId,
  organizationId,
}) => {
  const [pagination, setPagination] = useState({ limit: 10, page: 1 });
  const [deals, setDeals] = useState([]);
  const [dataInDB, setDataInDB] = useState(false);

  const getDeals = (count) => {
    const dealsFilter = {};

    if (contactId) dealsFilter.contact_person_id = contactId;
    if (organizationId) dealsFilter.contact_organization_id = organizationId;

    dealService
      .getDeals(dealsFilter, pagination)
      .then(({ data }) => {
        setDeals(data.deals);
        setPagination(data.pagination);
        if (count) setDataInDB(Boolean(data?.pagination?.totalPages));
      })
      .catch((err) => console.log(err));
  };

  const onPageChange = (page) => {
    setPagination({ ...pagination, page });
  };

  useEffect(() => {
    if (showModal) {
      getDeals(true);
    }
  }, [pagination.page, showModal]);

  const closeBtn = (
    <button
      className="close"
      style={{ fontSize: '30px' }}
      onClick={() => {
        setShowModal(false);
      }}
    >
      &times;
    </button>
  );

  return (
    <Modal isOpen={showModal} size="lg" fade={false}>
      <ModalHeader tag="h2" close={closeBtn}>
        Deals
      </ModalHeader>
      <ModalBody>
        <DealsTable
          data={deals}
          paginationInfo={pagination}
          onPageChange={onPageChange}
          dataInDB={dataInDB}
        />
      </ModalBody>
    </Modal>
  );
};

export default DealsTableModal;
