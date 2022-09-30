import { useState } from 'react';
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PipelineCard from './PipelineCard';
import routes from '../../../utils/routes.json';
import PipelineContactForm from './PipelineContactForm';
import Alert from '../../../components/Alert/Alert';
import AlertWrapper from '../../../components/Alert/AlertWrapper';
import dealService from '../../../services/deal.service';
import {
  DEAL_UPDATED,
  SOMETHING_IS_WRONG,
  CANT_ADD_CONTACT,
} from '../../../utils/constants';
import EmptyDataButton from '../../../components/emptyDataButton/EmptyDataButton';

const PipelineContactInfo = ({ deal, getDeal }) => {
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const dealContactInfo = deal?.contact;

  console.log(deal);

  const {
    id,
    email_home,
    email_other,
    email_work,
    first_name,
    last_name,
    primary_address_city,
    primary_address_country,
    primary_address_state,
    primary_address_street,
    status,
  } = dealContactInfo || {};

  const onHandleSubmit = async (dealFormData) => {
    const { contact_person_id, organization_id: contact_organization_id } =
      dealFormData || {};

    const formPerson = {
      contact_person_id,
      contact_organization_id,
    };

    const resp = await dealService
      .updateDeal(deal.id, formPerson)
      .catch(() => setErrorMessage(SOMETHING_IS_WRONG));

    if (resp?.data[0] === 0) {
      setEditMode(false);
      return setErrorMessage(CANT_ADD_CONTACT);
    }

    const { data } = resp || {};

    if (data.length) {
      setSuccessMessage(DEAL_UPDATED);
      getDeal();
      setEditMode(false);
    }
  };

  const pipelineInfo = () => {
    if (!deal?.contact && !editMode)
      return (
        <Col className="d-flex justify-content-center mb-4">
          <EmptyDataButton
            setOpenModal={setEditMode}
            message=""
            buttonLabel="Add Contact"
          />
        </Col>
      );

    if (editMode)
      return (
        <PipelineContactForm
          setEditMode={setEditMode}
          onHandleSubmit={onHandleSubmit}
          organizationId={deal.contact_organization_id}
        />
      );

    return (
      <div className="card-body toggle-org py-2">
        <ul className="list-group list-group-flush list-group-no-gutters">
          <li className="list-group-item d-flex align-items-center">
            <span className="">{`${first_name} ${last_name}`}</span>
            <span className="font-weight-medium ml-auto">
              <Link
                to={`${routes.contacts}/${id}/profile`}
                className="text-block"
              ></Link>
            </span>
          </li>
          <li className="list-group-item d-flex align-items-center">
            <span className="text-muted">Status</span>
            <span className="badge badge-lg badge-warning text-uppercase ml-auto">
              {status}
            </span>
          </li>
          <li className="list-group-item d-flex align-items-center">
            <span className="text-muted">Address</span>
            <span className="font-weight-medium text-right ml-auto">
              {`${primary_address_street || ''} ${primary_address_city || ''} ${
                primary_address_state || ''
              } ${primary_address_country || ''}`}
            </span>
          </li>
          <li className="list-group-item d-flex align-items-center">
            <span className="text-muted">Email</span>
            <span className="font-weight-medium ml-auto">
              {email_work || email_home || email_other}
            </span>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      <PipelineCard
        title="Contact"
        classNameProp="mt-4"
        onClick={() => {
          setEditMode((prev) => !prev);
        }}
      >
        {pipelineInfo()}
      </PipelineCard>
      <AlertWrapper>
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
        <Alert
          color="success"
          message={successMessage}
          setMessage={setSuccessMessage}
        />
      </AlertWrapper>
    </>
  );
};

export default PipelineContactInfo;
