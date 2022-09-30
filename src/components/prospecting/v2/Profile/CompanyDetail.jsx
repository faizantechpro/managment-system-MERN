import React, { useEffect, useState } from 'react';
import { Card, Col, Image, Row, Spinner } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router';

import prospectService from '../../../../services/prospect.service';
import TablePeopleProspect from '../common/TablePeopleProspect';
// import { companyRock } from '../constants';
import linkedinIcon from '../../../../assets/svg/linkedin.svg';
import facebookIcon from '../../../../assets/svg/facebook.svg';
import twitterIcon from '../../../../assets/svg/twitter.svg';
import LayoutHead from '../../../commons/LayoutHead';
import ModalConfirmDefault from '../../../modal/ModalConfirmDefault';
import stringConstants from '../../../../utils/stringConstants.json';
import AlertWrapper from '../../../Alert/AlertWrapper';
import Alert from '../../../Alert/Alert';
import contactService from '../../../../services/contact.service';
import routes from '../../../../utils/routes.json';
import organizationService from '../../../../services/organization.service';
import ButtonIcon from '../../../commons/ButtonIcon';

const constants = stringConstants.deals.prospecting;

const CompanyInfo = ({ details = {} }) => {
  const {
    name,
    description,
    phone,
    domain,
    linkedin_url,
    facebook_url,
    twitter_url,
  } = details;

  return (
    <Row noGutters className="w-100">
      <Col xs={12} className="d-flex flex-start">
        <Col
          xs={12}
          className="d-flex flex-row align-items-start flex-base p-0"
        >
          <div className="mr-auto">
            <h3 className="text-capitalize">{name}</h3>
            <p className="text-muted">{description}</p>
            <div className="text-muted">
              <Row noGutters>
                <Col xs={6}>
                  <p>
                    <span className="material-icons-outlined mr-2 text-muted">
                      public
                    </span>
                    <a
                      href={`https://www.${domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="my-0 cursor-pointer text-primary"
                    >
                      www.{domain}
                    </a>
                  </p>
                </Col>
                <Col xs={6}>
                  <p className="d-flex align-items-start w-100">
                    <span className="material-icons-outlined mr-2">call</span>
                    <span className="text-primary">
                      {phone || 'Not number'}
                    </span>
                  </p>
                </Col>
              </Row>
            </div>

            <div className="d-flex ">
              {linkedin_url && (
                <a href={linkedin_url} target="_blank" rel="noreferrer">
                  <Image src={linkedinIcon} roundedCircle />
                </a>
              )}
              {facebook_url && (
                <a
                  href={facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mx-3"
                >
                  <Image src={facebookIcon} roundedCircle />
                </a>
              )}
              {twitter_url && (
                <a href={twitter_url} target="_blank" rel="noreferrer">
                  <Image src={twitterIcon} roundedCircle />
                </a>
              )}
            </div>
          </div>
        </Col>
      </Col>
    </Row>
  );
};

const OrganizationDetails = ({ company = {} }) => {
  const {
    address,
    city,
    state,
    country,
    postal_code,
    revenue,
    year_founded,
    industry,
    employees,
    sic,
  } = company;

  return (
    <div className="w-100">
      <div className="border-bottom pb-3">
        <span className="fw-bold">Details</span>
      </div>
      <Row noGutters xs={12} className="w-100 mt-3">
        <Col xs={6} md className="px-0 mb-3">
          <div className="d-flex align-items-start w-100 ">
            <span className="material-icons-outlined mr-2 text-muted">
              place
            </span>
            <div>
              <p className="my-0">
                {city}, {state} {country} {address}
              </p>
              <p className="my-0">{postal_code}</p>
            </div>
          </div>
          <div>
            <span className="material-icons-outlined mr-2 text-muted">
              factory
            </span>
            <span className="fw-bold">Industry: </span>
            {industry}
          </div>
        </Col>
        <Col xs={6} md className="px-0">
          <div className="mb-2">
            <span className="fw-bold">SIC Code: </span>
            {sic}
          </div>
          <div className="mb-2">
            <span className="fw-bold">Revenue: </span>
            {revenue}
          </div>
          <div className="mb-2">
            <span className="fw-bold">Employees: </span>
            {employees}
          </div>
          <div className="mb-2">
            <span className="fw-bold">Year Founded: </span>
            {year_founded}
          </div>
        </Col>
      </Row>
    </div>
  );
};

const CompanyDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [currentCompany, setCurrentCompany] = useState({});
  const [currentProspect, setCurrentProspect] = useState({});
  const [prospects, setProspects] = useState([]);
  const [pagination, setPagination] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [charge, setCharge] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingTable, setLoadingTable] = useState(false);

  const getProspects = async (domain, page = 1) => {
    setLoadingTable(true);
    try {
      const response = await prospectService.query(
        {
          domain: [domain],
        },
        { page }
      );

      if (response.response?.status === 429) {
        setErrorMessage('Error getting prospects');
        throw new Error('Error getting prospects');
      }

      const {
        data,
        pagination: { start, total },
      } = response.data;

      setProspects(data);
      setPagination({
        page: start,
        total,
        totalPages: Math.ceil(total / 10),
      });
    } catch (e) {
      console.log(e);
    }
    setLoadingTable(false);
  };

  const getInfo = async () => {
    setCharge(true);
    setLoadingTable(true);
    try {
      const { data } = await prospectService.getCompany({
        name: id,
      });

      setCurrentCompany(data);
      getProspects(data.domain);
    } catch (e) {
      console.log(e);
    } finally {
      setCharge(false);
    }
  };

  const onPageChange = (page) => {
    getProspects(currentCompany.domain, page);
  };

  const onHandleEdit = (item) => {
    setOpenModal(true);
    setType(true);
    setCurrentProspect(item);
  };

  const saveProspect = async () => {
    setLoading(true);

    const company_id = await saveOrganization();

    const {
      id,
      region,
      city,
      title,
      current_title,
      work_email,
      work_phone,
      first_name,
      last_name,
    } = currentProspect;

    const dataContact = {
      first_name,
      last_name,
      email_home: work_email,
      title: current_title || title,
      primary_address_city: city,
      primary_address_state: region,
      phone_work: work_phone,
      status: 'cold',
      external_id: '' + id,
      organization_id: company_id || null,
    };

    try {
      const result = await contactService.createContact(dataContact);

      if (result?.response?.data?.code === 404) {
        setErrorMessage(result?.response?.data?.error);
      } else {
        const { data } = result;

        history.push(`${routes.contacts}/${data.id}/profile`);
      }
    } catch (error) {
      setErrorMessage(stringConstants.settings.security.errorMessage);
    }
    setLoading(false);
  };

  const saveOrganization = async () => {
    setLoading(false);

    const {
      name,
      industry,
      domain,
      ticker,
      city,
      phone,
      state,
      revenue,
      postal_code,
      sic,
      address,
    } = currentCompany;

    const dataOrganization = {
      name,
      industry,
      annual_revenue: revenue,
      phone_office: phone,
      website: domain,
      ticker_symbol: ticker,
      address_street: address,
      address_city: city,
      address_state: state,
      address_postalcode: postal_code,
      sic_code: sic,
      status: 'cold',
    };

    try {
      const { data } = await organizationService.createOrganization(
        dataOrganization
      );

      return data.id;
    } catch (e) {
      setErrorMessage(stringConstants.settings.security.errorMessage);
    }
  };

  const importOrganization = async () => {
    try {
      const organizationId = await saveOrganization();
      history.push(`${routes.contacts}/${organizationId}/organization/profile`);
    } catch (e) {
      setErrorMessage(stringConstants.settings.security.errorMessage);
    }
  };

  useEffect(() => {
    getInfo();
  }, [id]);

  return (
    <>
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
      <ModalConfirmDefault
        open={openModal}
        onHandleConfirm={!type ? importOrganization : saveProspect}
        onHandleClose={() => setOpenModal(false)}
        textBody={
          !type
            ? constants.importOrganizationMessage
            : constants.importContactMessage
        }
        icon="person_add_alt"
        loading={loading}
        labelButtonConfirm={'Yes, Import'}
        iconButtonConfirm=""
        colorButtonConfirm={'outline-success'}
      />
      <LayoutHead
        onHandleCreate={() => {
          setOpenModal(true);
          setType(false);
        }}
        icon=""
        buttonLabel={'Import Organization'}
        allRegister={''}
        dataInDB
      >
        <ButtonIcon
          icon="arrow_back"
          label=""
          classnames="btn-sm"
          color="white"
          onclick={() => {
            history.push(routes.prospects);
          }}
        />
      </LayoutHead>
      <Card className="mb-5">
        <Card.Body className="p-4">
          {charge && (
            <div className="text-center">
              <Spinner
                animation="border"
                className="ui-spinner-input my-3 text-primary"
                variant="primary"
              />
            </div>
          )}
          {!charge && (
            <Row className="w-100" noGutters>
              <Col xs={6} className="p-0">
                <CompanyInfo details={currentCompany} />
              </Col>
              <Col xs={6} className="px-4 border-md-left">
                <OrganizationDetails company={currentCompany} />
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      <div className={`mb-6`}>
        {loadingTable && (
          <div className="text-center">
            <Spinner
              animation="border"
              className="ui-spinner-input my-3 text-primary"
              variant="primary"
            />
          </div>
        )}
        {!loadingTable && currentCompany?.domain && (
          <TablePeopleProspect
            domain={currentCompany?.domain}
            data={prospects}
            pagination={pagination}
            onPageChange={onPageChange}
            onHandleEdit={onHandleEdit}
          />
        )}
      </div>
    </>
  );
};

export default CompanyDetail;
