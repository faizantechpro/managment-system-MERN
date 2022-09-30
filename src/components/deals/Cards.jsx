import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Link, useHistory } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

import dealService from '../../services/deal.service';
import ModalConfirm from '../modal/ModalConfirmDefault';
import { getProductsTotalAmount, isToFixedNoRound } from '../../utils/Utils';
import routes from '../../utils/routes.json';
import stringConstants from '../../utils/stringConstants.json';
import ActivitiesHistory from '../ActivitiesHistory/ActivitiesHistory';

import {
  CANT_REMOVE_DEAL,
  DEAL_DELETE_CONFIRMATION,
  DEAL_REMOVED,
  paginationDefault,
} from '../../utils/constants';
import Loading from '../Loading';
import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import Avatar from '../Avatar';

const Card = ({
  deal,
  index,
  onGetDeals,
  setNotification,
  loading,
  onAddDeal,
}) => {
  const history = useHistory();
  const {
    id,
    name,
    assigned_user,
    organization,
    contact,
    deal_products,
    amount,
    activities,
    deal_type,
    tenant_deal_stage_id,
  } = deal;

  const constants = stringConstants.deals.contacts.profile;
  const [removeDeal, setRemoveDeal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const contactName =
    organization?.name ||
    `${contact?.first_name || ''} ${contact?.last_name || ''}`;

  const onHandleRemove = async () => {
    setModalLoading(true);
    const resp = await dealService.deleteDeal(deal.id).catch((res) => {
      setNotification('error', res.message);

      setModalLoading(false);
    });

    if (resp?.response?.status === 401) {
      setNotification('error', CANT_REMOVE_DEAL);
    }

    if (resp.data) {
      setNotification('success', DEAL_REMOVED);
      setModalLoading(false);
    }

    toggleModal();
    onGetDeals(deal_type, tenant_deal_stage_id, paginationDefault.page);
  };

  const toggleModal = () => {
    setRemoveDeal((prev) => !prev);
  };

  const onHandleEdit = () => history.push(`${routes.dealsPipeline}/${id}`);

  // const onHandleAdd = () => {
  //   onAddDeal();
  // };

  const responseActivity = (msg) => {
    onGetDeals(
      deal?.tenant_deal_stage?.deal_stage?.name,
      deal.tenant_deal_stage_id,
      deal.position,
      paginationDefault.page
    );
    switch (msg) {
      case constants.activityAdded:
        return setSuccessMessage(constants.activityAdded);
      case constants.updatedActivity:
        return setSuccessMessage(constants.updatedActivity);
      case constants.activityError:
        return setErrorMessage(constants.activityError);
      case constants.errorUpdatedActivity:
        return setErrorMessage(constants.errorUpdatedActivity);
      default:
        return false;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      {loading === id && (
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            left: '45%',
            zIndex: 100,
          }}
        >
          <Loading />
        </div>
      )}

      <Draggable
        key={id}
        draggableId={`id-${id}`}
        index={index}
        isDragDisabled={Boolean(loading)}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="card mb-1 rounded"
          >
            <div
              className="card-body p-3 pb-0 position-relative"
              style={{
                background: loading === id && 'rgba(0,0,0,0.2)',
                opacity: loading === id && '0.8',
              }}
            >
              <Row className="d-flex">
                <Col className="mr-2 deal-card">
                  <div onClick={onHandleEdit}>
                    <h5 className="text-wrap mb-1 fs-7">
                      {name}
                      <Link
                        to={`/settings/profile/users/${assigned_user?.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {` (${assigned_user?.first_name} ${assigned_user?.last_name})`}
                      </Link>
                    </h5>
                    <p className="text-muted fs-8 mb-2">{contactName}</p>
                  </div>
                  <Row className="pb-3">
                    <Col className="col">
                      <div className="media pb-2">
                        <Link
                          to={`${routes.contacts}/${id}/profile`}
                          className="cursor-pointer"
                        >
                          <Avatar user={assigned_user} defaultSize="xs" />
                        </Link>
                        <span className="text-primary font-weight-semi-bold mr-auto mt-1 ml-2 fs-8">
                          {deal_products?.length
                            ? isToFixedNoRound(
                                getProductsTotalAmount(deal_products),
                                2
                              )
                            : isToFixedNoRound(amount, 2)}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <div className="d-flex flex-column justify-content-center align-items-center mh-100 pb-2">
                  <span
                    className="flex-grow-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ActivitiesHistory
                      className="material-icons-outlined"
                      icon={'today'}
                      organizationId={organization?.id}
                      response={responseActivity}
                      dealId={id}
                      activities={activities}
                    />
                  </span>
                  <span
                    className={`label alert mb-1 text-center mr-2 alert-sm fs-9 fw-bold text-uppercase text-white py-1 px-2 deal-types ${deal.status}`}
                  >
                    {deal.status}
                  </span>
                </div>
              </Row>
            </div>
          </div>
        )}
      </Draggable>

      <ModalConfirm
        open={removeDeal}
        onHandleConfirm={onHandleRemove}
        onHandleClose={toggleModal}
        textBody={DEAL_DELETE_CONFIRMATION}
        iconButtonConfirm="people"
        colorButtonConfirm={'outline-danger'}
        icon="report_problem"
        loading={modalLoading}
      />
    </div>
  );
};

export default Card;
