import { useEffect, useState } from 'react';
import { Card, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { capitalize, findIndex } from 'lodash';
import { animateScroll as scroll } from 'react-scroll';
import { useHistory, Link } from 'react-router-dom';
import { Badge, Spinner } from 'reactstrap';

import MoreActions from '../../../components/MoreActions';
import {
  ADD_PRODUCTS,
  ERROR_CONTACT_UPDATE_CUSTOMER,
  ERROR_ORGANIZATION_UPDATE_CUSTOMER,
  ERROR_UPDATE_STATUS,
  items,
  LOST,
  WON,
  NO_CONTACT_PERSON,
  NO_ORGANIZATION,
  CONTACT_NOT_FOUND,
  REOPEN,
  PIPELINE_LABEL,
  DEAL_REOPENED,
} from './Pipeline.constants';
import dealService from '../../../services/deal.service';
import contactService from '../../../services/contact.service';
import organizationService from '../../../services/organization.service';
import AlertWrapper from '../../../components/Alert/AlertWrapper';
import Alert from '../../../components/Alert/Alert';
import {
  DEAL_DELETE_CONFIRMATION,
  DEAL_REMOVED,
  CANT_REMOVE_DEAL,
} from '../../../utils/constants';
import ModalConfirm from '../../../components/modal/ModalConfirmDefault';
import { isToFixedNoRound, pageTitleBeautify } from '../../../utils/Utils';
import routes from '../../../utils/routes.json';
import { tagsColor } from '../../../views/Deals/contacts/Contacts.constants';
import IdfOwnersHeader from '../../../components/idfComponents/idfAdditionalOwners/IdfOwnersHeader';
import { Helmet } from 'react-helmet-async';
import userService from '../../../services/user.service';
import roleService from '../../../services/role.service';
import stageService from '../../../services/stage.service';

const PipelineHeader = ({
  classnames,
  deal,
  getDeal,
  refreshOwners,
  setRefresOwners,
  isPrincipalOwner,
  refreshPipelineStage,
}) => {
  const history = useHistory();

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [removeDeal, setRemoveDeal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [reopen, setReopen] = useState(false);
  const [itemsOptions, setItemsOptions] = useState(items);
  const [stages, setStages] = useState([]);
  const [updatingStage, setUpdatingStage] = useState('');

  console.log(stages.deal_stage);

  const getDealStage = (deal) => {
    return stages.find((stage) => stage.id === deal.tenant_deal_stage_id);
  };

  const getCurrentUser = async () => {
    try {
      const user = await userService.getUserInfo();
      const permissions = await roleService.getPermissionsByRole(user.role);

      const deleteDeals = permissions.filter(
        (permission) =>
          permission.collection === 'deals' && permission.action === 'delete'
      );

      if (deleteDeals.length === 0) {
        const newItems = items.filter((item) => item.id !== 'remove');

        setItemsOptions(newItems);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onChangeStage = async (stage) => {
    setUpdatingStage(stage.id);
    await dealService.updateDealStage({
      data: [{ id: deal.id, tenant_deal_stage_id: stage.id }],
    });
    getDeal();
    setUpdatingStage('');
    setSuccessMessage('Deal updated successfully.');
  };

  const onChangeStatus = async (status) => {
    const customer = {
      is_customer: status === WON,
    };

    if (!deal?.contact_person_id && !deal?.contact_organization_id)
      return setErrorMessage(CONTACT_NOT_FOUND);

    const data = {
      status: status,
    };

    if (status !== WON && status !== LOST) {
      data.sales_stage = status;
    }

    const dealUpdated = await dealService
      .updateDeal(deal.id, data)
      .catch(() => setErrorMessage(ERROR_UPDATE_STATUS));

    if (dealUpdated.status === 401) {
      return setErrorMessage(ERROR_UPDATE_STATUS);
    }

    if (dealUpdated?.data[0] === 0) {
      return setErrorMessage(ERROR_UPDATE_STATUS);
    }

    if (dealUpdated?.contact_person_id) {
      await contactService
        .updateContact(deal?.contact_person_id, customer)
        .catch(() => setErrorMessage(ERROR_CONTACT_UPDATE_CUSTOMER));
    }

    if (deal?.contact_organization_id) {
      await organizationService
        .updateOrganization(deal?.contact_organization_id, customer)
        .catch(() => setErrorMessage(ERROR_ORGANIZATION_UPDATE_CUSTOMER));
    }

    getDeal();

    setSuccessMessage('Deal updated successfully.');
  };

  const setNotification = async (notificationCode, description) => {
    const notificationsStatus = {
      success: setSuccessMessage,
      error: setErrorMessage,
    };

    notificationsStatus[notificationCode](description);
  };

  const onHandleRemove = async () => {
    setModalLoading(true);
    const resp = await dealService.deleteDeal(deal.id).catch(() => {
      setNotification('error', CANT_REMOVE_DEAL);
      setModalLoading(false);
      return toggleModal();
    });

    if (resp?.response?.data?.errors?.[0]?.message) {
      setNotification('error', CANT_REMOVE_DEAL);
      setModalLoading(false);
      return toggleModal();
    }

    if (resp?.data) {
      setNotification('success', DEAL_REMOVED);
      setModalLoading(false);

      setTimeout(() => {
        history.push(routes.dealsPipeline);
      }, 3000);
    }

    toggleModal();
  };

  const toggleModal = () => {
    setRemoveDeal((prev) => !prev);
  };

  const reopenDeal = async () => {
    setReopen(true);

    const data = {
      status: null,
    };

    const reopened = await dealService
      .updateDeal(deal.id, data)
      .catch(() => setErrorMessage(ERROR_UPDATE_STATUS));

    const { data: reopenedData } = reopened || {};

    if (reopenedData[0] === 0) {
      setErrorMessage(ERROR_UPDATE_STATUS);
      return setReopen(false);
    }

    setSuccessMessage(DEAL_REOPENED);
    getDeal();
    setReopen(false);
  };

  const textColor = (index) => {
    const stageIndex = findIndex(stages, {
      id: deal.tenant_deal_stage_id || 'cold',
    });

    if (index <= stageIndex) {
      if (deal.status === 'lost') return '';

      return 'text-light';
    }

    return 'text-secondary';
  };

  const getStages = async () => {
    const stages = await stageService.getStages();
    setStages(stages);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    getStages();
  }, []);

  return (
    <>
      <Helmet>
        <title>{pageTitleBeautify([deal.name, 'Deals'])}</title>
      </Helmet>
      <Col className="d-flex align-items-center mb-2">
        <h1 className="page-header-title">{deal.name}</h1>
      </Col>
      <Col className="w-50 mb-5 d-flex align-items-center">
        {Object.keys(deal).length ? (
          <Badge
            color={tagsColor[deal?.status]}
            style={{ fontSize: '12px' }}
            className="text-uppercase"
          >
            {deal?.status}
          </Badge>
        ) : null}
        <IdfOwnersHeader
          className="mx-3"
          mainOwner={deal?.assigned_user}
          service={dealService}
          serviceId={deal?.id}
          refreshOwners={refreshOwners}
          setRefresOwners={setRefresOwners}
          isprincipalowner={isPrincipalOwner}
        />
      </Col>
      <Card className="mb-5">
        <Card.Body>
          <Row className="d-flex justify-content-between align-items-center">
            <Col xs lg="auto">
              <Row className="d-flex align-items-center mt-2 mb-2">
                <Col xs="auto d-flex align-items-center">
                  <span className="fs-5">{isToFixedNoRound(deal?.amount)}</span>
                  <span
                    className="text-primary ml-2 cursor-pointer"
                    onClick={() => scroll.scrollToBottom()}
                  >
                    {deal?.deal_products?.length
                      ? `${deal?.deal_products?.length} products`
                      : `+ ${ADD_PRODUCTS}`}
                  </span>
                </Col>
                |
                <Col xs="auto" className="d-flex align-center">
                  <span className="material-icons-outlined">person</span>
                  {!deal?.contact_person_id ? (
                    <span> {NO_CONTACT_PERSON} </span>
                  ) : (
                    <Link
                      to={`${routes.contacts}/${deal?.contact_person_id}/profile`}
                      className="ml-2 decoration-underline"
                    >
                      {`${deal?.contact?.first_name} ${deal?.contact?.last_name}`}
                    </Link>
                  )}
                </Col>
                |
                <Col xs="auto">
                  <span className="material-icons-outlined">business</span>
                  {!deal?.contact_organization_id ? (
                    <span className="ml-2">{NO_ORGANIZATION}</span>
                  ) : (
                    <Link
                      to={`${routes.contacts}/${deal?.contact_organization_id}/organization/profile`}
                      className="ml-2 decoration-underline"
                    >
                      {deal?.organization?.name}
                    </Link>
                  )}
                </Col>
              </Row>
            </Col>
            <Col className="d-flex justify-content-end">
              {!deal.status && (
                <>
                  <Col xs="auto" className="d-flex align-items-center pr-0">
                    <button
                      className="btn btn-success h-75 d-flex align-items-center"
                      data-dismiss="modal"
                      onClick={() => onChangeStatus(WON)}
                    >
                      {capitalize(WON)}
                    </button>
                  </Col>
                  <Col xs="auto" className="d-flex align-items-center pr-0">
                    <button
                      className="btn btn-danger h-75 d-flex align-items-center"
                      data-dismiss="modal"
                      onClick={() => onChangeStatus(LOST)}
                    >
                      {capitalize(LOST)}
                    </button>
                  </Col>
                </>
              )}

              {(deal.status === WON || deal.status === LOST) && (
                <Col xs="auto" className="d-flex align-items-center pr-0">
                  <button
                    className="btn btn-outline-primary h-75 d-flex align-items-center"
                    data-dismiss="modal"
                    onClick={() => reopenDeal()}
                    disabled={reopen}
                  >
                    {capitalize(REOPEN)}
                  </button>
                </Col>
              )}

              <Col xs="auto" className="d-flex align-items-center pr-0">
                <MoreActions
                  items={itemsOptions}
                  toggleClassName="dropdown-search btn-icon"
                  variant="outline-link"
                  onHandleRemove={toggleModal}
                />
              </Col>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <div className="row align-items-center no-gutters mt-2">
                <div className="col-auto w-100">
                  <ul className="step-bar sm">
                    {stages?.map((stage, index) => (
                      <li
                        key={stage.id}
                        className={`${classnames(
                          index,
                          stages,
                          deal
                        )} cursor-pointer position-relative`}
                        onClick={() => onChangeStage(stage)}
                      >
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 50, hide: 250 }}
                          overlay={
                            <Tooltip
                              id={`tooltip`}
                              className={`tooltip-profile font-weight-bold `}
                            >
                              <p>{stage?.deal_stage?.name}</p>
                              <p>{`Been here for ${
                                stage?.deal_stage?.days || 0
                              } days`}</p>
                            </Tooltip>
                          }
                        >
                          <span className={textColor(index)}>
                            {stage?.deal_stage?.name}
                          </span>
                        </OverlayTrigger>
                        {updatingStage === stage.id && (
                          <div className="position-absolute content-centered-x">
                            {' '}
                            <Spinner color="black" size="sm" />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex align-items-center fs-7">
              {PIPELINE_LABEL}
              <span className="material-icons-outlined">chevron_right</span>
              {capitalize(getDealStage(deal)?.deal_stage?.name)}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <AlertWrapper>
        <Alert
          message={errorMessage}
          setMessage={setErrorMessage}
          color="danger"
        />
        <Alert
          message={successMessage}
          setMessage={setSuccessMessage}
          color="success"
        />
      </AlertWrapper>

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
    </>
  );
};

export default PipelineHeader;
