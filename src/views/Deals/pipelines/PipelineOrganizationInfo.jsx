import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import PipelineCard from './PipelineCard';
import routes from '../../../utils/routes.json';
import stringConstants from '../../../utils/stringConstants.json';
import PipelineOrganizationForm from './PipelineOrganizationForm';
import Alert from '../../../components/Alert/Alert';
import AlertWrapper from '../../../components/Alert/AlertWrapper';
import dealService from '../../../services/deal.service';
import {
  DEAL_UPDATED,
  LINK_ORGANIZATION,
  SOMETHING_IS_WRONG,
  NO_ORGANIZATION_ASSIGNED,
} from '../../../utils/constants';
import SimpleModal from '../../../components/modal/SimpleModal';
import DropdownSearch from '../../../components/DropdownSearch';
import organizationService from '../../../services/organization.service';
import { ERROR_UPDATE_STATUS } from './Pipeline.constants';
import { formatNumber } from '../../../utils/Utils';

const constants = stringConstants.deals.contacts.profile;

const getEncodedURL = (data) => {
  const string =
    (data.address_street || '') +
    (data.address_city || '') +
    (data.address_state ? ', ' : '') +
    (data.address_state || '') +
    (data.address_postalcode || '') +
    (data.address_country || '');

  const encodedurl = encodeURIComponent(string);
  return encodedurl;
};

const items = {
  phone_office: constants.phoneLabel,
  annual_revenue: constants.totalRevenue,
  employees: constants.employeesLabel,
  website: constants.websiteLabel,
  naics_code: constants.naicsCodeLabel,
  industry: constants.industryLabel,
};
const OrgCardRow = ({ left, right, margin = 4 }) => {
  return (
    <>
      <span className="text-muted">{left}</span>
      <span className="font-weight-medium ml-auto">{right}</span>
    </>
  );
};
const ItemList = ({ value = '', name }) => {
  if (name === 'total_revenue') value = formatNumber(value, 1);
  const left = (
    <span className="text-muted font-weight-medium mr-2">{items[name]}</span>
  );
  const right = <span className="font-weight-medium ml-auto">{value}</span>;
  return (
    <li className="list-group-item d-flex align-items-center">
      <OrgCardRow
        left={left}
        right={
          name === 'website' ? (
            <a
              href={value.includes('http') ? value : 'https://' + value}
              target="_blank"
              rel="noopener noreferrer"
            >
              {right}
            </a>
          ) : (
            right
          )
        }
        margin={6}
      />
    </li>
  );
};

const PipelineOrganizationInfo = ({ deal, getDeal }) => {
  const [editMode, setEditMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [allOrganizations, setAllOrganizations] = useState([]);

  const dealOrgInfo = deal?.organization;

  const { id, name } = dealOrgInfo || {};

  const handleCloseModal = () => {
    setSelectedOrg({});
    setOpenModal(false);
  };

  const getOrganizations = ({ search, limit = 5 }) => {
    setSelectedOrg({});
    organizationService
      .getOrganizations({ search }, { limit })
      .then((res) => {
        setAllOrganizations(res.data.organizations);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const onHandleSubmit = async (dealFormData) => {
    const { contact_organization_id } = dealFormData || {};

    const formOrganization = {
      contact_organization_id,
      contact_person_id: null,
    };

    const resp = await dealService
      .updateDeal(deal.id, formOrganization)
      .catch(() => setErrorMessage(SOMETHING_IS_WRONG));

    if (resp?.data[0] === 0) {
      setEditMode(false);
      return setErrorMessage(ERROR_UPDATE_STATUS);
    }

    const { data } = resp || {};

    if (data.length) {
      setSuccessMessage(DEAL_UPDATED);
      getDeal();
      setOpenModal(false);
      setEditMode(false);
    }
  };

  const handleLinkOrg = () => {
    onHandleSubmit({ contact_organization_id: selectedOrg.id });
  };

  useEffect(() => {
    getOrganizations({});
  }, []);

  const pipelineInfo = () => {
    if (!dealOrgInfo && !editMode)
      return (
        <Col className="d-flex justify-content-center flex-column align-items-center  my-4">
          <p>{NO_ORGANIZATION_ASSIGNED}</p>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <span className="material-icons-outlined mr-1">add</span>
            {LINK_ORGANIZATION}
          </button>
        </Col>
      );

    if (editMode)
      return (
        <PipelineOrganizationForm
          setEditMode={setEditMode}
          onHandleSubmit={onHandleSubmit}
        />
      );

    return (
      <div className="card-body toggle-org py-2">
        <ul className="list-group list-group-flush list-group-no-gutters">
          <li className="list-group-item d-flex align-items-center">
            <span className="text-muted">Name</span>
            <span className="font-weight-medium ml-auto">
              <Link
                to={`${routes.contacts}/${id}/organization/profile`}
                className="text-block"
              >
                {name}
              </Link>
            </span>
          </li>
          <li className="list-group-item d-flex align-items-center">
            <span className="text-muted">{constants.addressLabel}</span>
            <span className="font-weight-medium ml-auto">
              <a
                target={'_blank'}
                rel="noreferrer"
                href={`https://www.google.com/maps/search/?api=1&query=${getEncodedURL(
                  dealOrgInfo && dealOrgInfo
                )}`}
              >
                <span>{dealOrgInfo?.address_street || ''}</span>
                <span>{dealOrgInfo?.address_city || ''}</span>
                <span>
                  {dealOrgInfo?.address_state ? ',' : ''}{' '}
                  {dealOrgInfo?.address_state || ''}
                </span>
                <span>{dealOrgInfo?.address_postalcode || ''}</span>
                <span>{dealOrgInfo?.address_country || ''}</span>
              </a>
            </span>
          </li>
          {Object.keys(items).map((key) => {
            return (
              <ItemList value={dealOrgInfo?.[key] || ''} key={key} name={key} />
            );
          })}
          {/* <li className="list-group-item d-flex align-items-center">
            <span className="text-muted">Label</span>
            <span className="ml-auto">
              <Badge
                id={label?.id}
                style={{
                  fontSize: '12px',
                  backgroundColor: `${label?.color}`,
                }}
                className="text-uppercase"
              >
                {label?.name}
              </Badge>
            </span>
          </li> */}
        </ul>
      </div>
    );
  };

  return (
    <>
      <SimpleModal
        onHandleCloseModal={handleCloseModal}
        open={openModal}
        buttonLabel={'Link this Organization'}
        buttonsDisabled={!selectedOrg.id}
        handleSubmit={handleLinkOrg}
      >
        <DropdownSearch
          title="Search organization"
          data={allOrganizations}
          customTitle="name"
          onChange={(event) => {
            if (event) {
              const { value } = event.target;
              getOrganizations({ search: value, limit: 10 });
            }
          }}
          onHandleSelect={(item) => {
            setSelectedOrg(item);
          }}
        />
      </SimpleModal>
      <PipelineCard
        title="Organization"
        classNameProp="mt-4"
        onClick={() => {
          setEditMode((prev) => !prev);
        }}
        noEditIcon={!dealOrgInfo}
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

export default PipelineOrganizationInfo;
