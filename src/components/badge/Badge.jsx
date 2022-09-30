import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import BadgeTable from './BadgeTable';
import ModalConfirm from '../modal/ModalConfirmDefault';
import badgeService from '../../services/badge.service';
import stringConstants from '../../utils/stringConstants.json';
import LayoutHead from '../commons/LayoutHead';
import { sortingTable } from '../../utils/sortingTable';

const constants = stringConstants.settings.resources.badges;
const defaultPagination = { page: 1, limit: 10 };

const Badge = ({ setCreateMode, setId }) => {
  const [badges, setBadges] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [dataInDB, setDataInDB] = useState(false);
  const [order, setOrder] = useState([]);

  const getBadges = async (count) => {
    const badges = await badgeService.getBadges({ ...pagination, order });
    setBadges(badges.data);
    setPagination(badges.pagination);
    if (count) setDataInDB(Boolean(badges?.pagination?.totalPages));
  };

  const changePaginationPage = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    setSelectedBadges([]);
  };

  const deleteBadges = () => {
    const deletedBadges = selectedBadges.map((badgeId) => {
      return badgeService.deleteBadge(badgeId);
    });

    Promise.all(deletedBadges)
      .then(() => {
        setSuccessMessage(constants.successMessage);
        getBadges();
        setSelectedBadges([]);
      })
      .catch((e) => {
        setErrorMessage(e?.response?.data?.errors?.[0]?.message);
      })
      .finally(() => {
        setOpenModal(false);
      });
  };

  const onHandleEdit = (event) => {
    setCreateMode(true);
    setId(event.id);
  };

  useEffect(() => {
    getBadges(true);
  }, []);

  useEffect(() => {
    getBadges();
  }, [pagination?.page, order]);

  const sortTable = ({ name }) => sortingTable({ name, order, setOrder });

  return (
    <div className="row justify-content-center">
      <AlertWrapper>
        <Alert
          message={successMessage}
          setMessage={setSuccessMessage}
          color="success"
        />
        <Alert
          message={errorMessage}
          setMessage={setSuccessMessage}
          color="danger"
        />
      </AlertWrapper>
      <ModalConfirm
        open={openModal}
        onHandleConfirm={deleteBadges}
        onHandleClose={() => setOpenModal(false)}
        textBody={constants.deleteConfirmation}
        labelButtonConfirm="Yes, Delete"
        iconButtonConfirm="delete"
        colorButtonConfirm="outline-danger"
      />
      <div className="col-lg-12">
        <LayoutHead
          onHandleCreate={() => {
            setCreateMode(true);
            setId('');
          }}
          buttonLabel={constants.addBadgeLabel}
          selectedData={selectedBadges}
          onDelete={() => setOpenModal(true)}
          allRegister={`${pagination.count || 0} Badges`}
          dataInDB={dataInDB}
        />
        <Card className="mb-5">
          <Card.Body className="p-0">
            <BadgeTable
              onHandleEdit={onHandleEdit}
              dataSource={badges}
              selectedData={selectedBadges}
              setSelectedData={setSelectedBadges}
              paginationInfo={pagination}
              onPageChange={changePaginationPage}
              dataInDB={dataInDB}
              setCreateMode={setCreateMode}
              sortingTable={sortTable}
            />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Badge;
