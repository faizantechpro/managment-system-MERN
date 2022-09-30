import React, { useEffect, useState } from 'react';
import { Card, Col, Image, Row, Spinner } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router';
// import { companyRock } from '../constants';
import prospectService from '../../../../services/prospect.service';
import linkedinIcon from '../../../../assets/svg/linkedin.svg';
import facebookIcon from '../../../../assets/svg/facebook.svg';
import twitterIcon from '../../../../assets/svg/twitter.svg';
import Avatar from '../../../Avatar';
import TablePeopleProspect from '../common/TablePeopleProspect';
import ModalConfirmDefault from '../../../modal/ModalConfirmDefault';
import stringConstants from '../../../../utils/stringConstants.json';
import LayoutHead from '../../../commons/LayoutHead';
import contactService from '../../../../services/contact.service';
import AlertWrapper from '../../../Alert/AlertWrapper';
import Alert from '../../../Alert/Alert';
import routes from '../../../../utils/routes.json';
import organizationService from '../../../../services/organization.service';
import ButtonIcon from '../../../commons/ButtonIcon';

const constants = stringConstants.deals.prospecting;

const ContactInfo = ({ details = {} }) => {
  const {
    name,
    current_title,
    current_employer,
    current_work_email,
    phones,
    profile_pic,
    location,
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
          <Avatar
            user={{ first_name: name, avatarSrc: profile_pic }}
            classModifiers="avatar-xl mr-4"
          />
          <div className="mr-auto">
            <h3 className="text-capitalize">{name}</h3>
            <p className="text-muted">
              {current_title}, {current_employer}
            </p>
            <div className="text-muted">
              <p>
                <span className="material-icons-outlined mr-2">pin_drop</span>
                <span className="text-primary">{location}</span>
              </p>
              <p>
                <span className="material-icons-outlined mr-2">business</span>
                <a
                  className="text-primary cursor-pointer"
                  href={`${routes.prospects}/company/${current_employer}`}
                >
                  {current_employer}
                </a>
              </p>
              <p>
                <span className="material-icons-outlined mr-2">email</span>
                <span className="text-primary">
                  {current_work_email || 'N/A'}
                </span>
              </p>
              <p>
                <span className="material-icons-outlined mr-2">call</span>
                <span className="text-primary">
                  {phones?.length > 0 ? phones[0]?.number : 'N/A'}
                </span>
              </p>
            </div>

            <div className="d-flex ">
              {linkedin_url && (
                <a href={linkedin_url} target="_blank" rel="noreferrer">
                  <Image src={linkedinIcon || ''} roundedCircle />
                </a>
              )}
              {facebook_url && (
                <a
                  href={facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mx-3"
                >
                  <Image src={facebookIcon || ''} roundedCircle />
                </a>
              )}
              {twitter_url && (
                <a href={twitter_url} target="_blank" rel="noreferrer">
                  <Image src={twitterIcon || ''} roundedCircle />
                </a>
              )}
            </div>
          </div>
        </Col>
      </Col>
    </Row>
  );
};

const ExperienceInfo = ({ jobHistory = [] }) => {
  return (
    <div className="mr-2 p-3 pt-0">
      <div className="border-bottom pb-3">
        <span className="fw-bold">Experience</span>
      </div>
      <div>
        {jobHistory
          .slice(0, 9)
          .map(({ company_name, end_date, start_date, title }, index) => (
            <div
              key={index}
              className={`${
                index === jobHistory.length - 1 ? '' : 'border-bottom'
              } pt-2`}
            >
              <p className="text-muted mb-1">{company_name}</p>
              <p className="fw-bold mb-1">{title}</p>
              <p className="text-muted">
                {start_date} — {end_date}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

const EducationInfo = ({ education = [] }) => {
  return (
    <div className="mr-2 p-3 pt-0">
      <div className="border-bottom pb-3">
        <span className="fw-bold">Education</span>
      </div>
      <div>
        {education.map(({ school, start, end, degree }, index) => (
          <div
            key={index}
            className={`${
              index === education.length - 1 ? '' : 'border-bottom'
            } pt-2`}
          >
            <p className="text-muted mb-1">{school}</p>
            <p className="fw-bold mb-1">{degree}</p>
            <p className="text-muted">
              {start} — {end}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrganizationDetails = ({ company = {} }) => {
  const history = useHistory();
  const {
    name,
    domain,
    address,
    city,
    state,
    country,
    postal_code,
    employees,
    revenue,
    sic,
    phone,
    year_founded,
    industry,
    linkedin_url,
    facebook_url,
    twitter_url,
  } = company;

  return (
    <div className="w-100">
      <h3
        className="text-capitalize cursor-pointer"
        onClick={() => history.push(`${routes.prospects}/company/${name}`)}
      >
        {name}
      </h3>
      <Row noGutters xs={12} className="w-100">
        <Col xs={6} md className="px-0 mb-3">
          <div className="d-flex align-items-start w-100">
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
          <div className="d-flex align-items-start w-100 mt-3">
            <span className="material-icons-outlined mr-2 text-muted">
              public
            </span>
            <div>
              <a
                href={`https://www.${domain}`}
                target="_blank"
                rel="noreferrer"
                className="my-0 cursor-pointer text-primary"
              >
                {`www.${domain}` || 'N/A'}
              </a>
            </div>
          </div>

          <div className="d-flex align-items-start w-100 mt-3">
            <span className="material-icons-outlined mr-2">call</span>
            <span className="text-primary">{phone || 'N/A'}</span>
          </div>
        </Col>
        <Col xs={6} md className="px-0">
          <div className="mb-2">
            <span className="fw-bold">Industry: </span>
            {industry}
          </div>
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
  );
};

const PeopleDetail = () => {
  const { id } = useParams();

  const history = useHistory();
  const [currentContact, setCurrentContact] = useState({});
  const [importProspect, setImportProspect] = useState({});
  const [currentCompany, setCurrentCompany] = useState({});
  const [prospects, setProspects] = useState([]);
  const [pagination, setPagination] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [charge, setCharge] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  const [type, setType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const getProspects = async (domain, page = 1) => {
    setLoadingTable(true);
    try {
      const response = await prospectService.query(
        {
          company_domain: [domain],
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
      const { data } = await prospectService.getContact({ id });

      setCurrentContact(data);
      const filter = { name: data.current_employer };

      const result = await prospectService.getCompany(filter);

      setCurrentCompany(result.data);
      getProspects(result.data?.domain);
    } catch (e) {
      console.log(e);
    } finally {
      setCharge(false);
    }
  };

  const onPageChange = (page) => {
    getProspects(currentCompany?.domain, page);
  };

  const onHandleImport = (prospect) => {
    const {
      id,
      region,
      city,
      current_title,
      work_email,
      work_phone,
      first_name,
      last_name,
    } = prospect;

    const dataContact = {
      first_name,
      last_name,
      email_home: work_email,
      title: current_title,
      primary_address_city: city,
      primary_address_state: region,
      phone_work: work_phone,
      status: 'cold',
      external_id: '' + id,
    };

    setImportProspect(dataContact);
    setType(true);
    setOpenModal(true);
  };

  const saveProspect = async (dataContact) => {
    setLoading(true);
    await contactService
      .getContact({ external_id: currentContact.id }, {})
      .then(async ({ data }) => {
        const { contacts } = data;
        if (contacts?.length > 0) {
          setErrorMessage('Contact was imported already!');
          return;
        }

        let organizationId;
        const {
          name,
          industry,
          domain,
          ticker,
          city,
          state,
          country,
          postal_code,
          sic,
        } = currentCompany;

        const dataOrganization = {
          name,
          industry,
          website: domain,
          ticker_symbol: ticker,
          // address_street: address,
          address_city: city,
          address_state: state,
          address_country: country,
          address_postalcode: postal_code,
          sic_code: sic,
          status: 'cold',
        };

        try {
          const { data } = await organizationService.createOrganization(
            dataOrganization
          );

          organizationId = data.id;
        } catch (e) {
          setErrorMessage(stringConstants.settings.security.errorMessage);
          return;
        }

        try {
          const result = await contactService.createContact({
            ...dataContact,
            organization_id: organizationId,
          });

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
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const confirmProspect = () => {
    const {
      first_name,
      last_name,
      work_email,
      work_phone,
      title,
      current_title,
      city,
      state,
      country,
      id,
      name,
      current_work_email,
    } = currentContact;

    const nameParts = name.split(' ');

    const dataImport = {
      first_name: first_name || nameParts[0],
      last_name: last_name || nameParts[1],
      email_work: work_email || current_work_email,
      title: title || current_title,
      primary_address_city: city,
      primary_address_state: state,
      primary_address_country: country,
      phone_mobile: work_phone,
      status: 'cold',
      external_id: id + '',
      organization_id: null,
    };

    saveProspect(dataImport);
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
        onHandleConfirm={
          type ? saveProspect.bind(null, importProspect) : confirmProspect
        }
        onHandleClose={() => setOpenModal(false)}
        textBody={constants.importContactMessage}
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
        buttonLabel={'Import Contact'}
        allRegister={''}
        dataInDB
      >
        <ButtonIcon
          icon="arrow_back"
          label=""
          classnames="btn-sm"
          color="white"
          onclick={() => {
            history.push(`${routes.prospects}?back=true`);
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
            <Row className="w-100">
              <Col xs={12} lg={5}>
                <Col xs={12} className="p-0 pb-4 border-bottom">
                  <ContactInfo details={currentContact} />
                </Col>
                <Col xs={12} className="p-0 mt-4">
                  <OrganizationDetails company={currentCompany} />
                </Col>
              </Col>
              <Col xs={12} lg={7} className="m-t-md-4">
                <Row className="w-100" noGutters>
                  <Col xs={6} lg={6} className="border-md-left">
                    <ExperienceInfo jobHistory={currentContact?.job_history} />
                  </Col>
                  <Col xs={6} lg={6} className="border-left">
                    <EducationInfo education={currentContact?.education} />
                  </Col>
                </Row>
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
            onHandleEdit={onHandleImport}
          />
        )}
      </div>
    </>
  );
};

export default PeopleDetail;
