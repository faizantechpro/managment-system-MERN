import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import './style.css';
import HeadingWithTitle from './HeadingWithTitle';
import stringConstants from '../../utils/stringConstants.json';
import { capitalize, pageTitleBeautify } from '../../utils/Utils';
import ModalConfirmDefault from '../modal/ModalConfirmDefault';
import organizationService from '../../services/organization.service';
import contactService from '../../services/contact.service';
import AlertWrapper from '../Alert/AlertWrapper';
import Alert from '../Alert/Alert';
import ButtonIcon from '../commons/ButtonIcon';
import ProspectList from './ProspectList';
import ContactInfo from './ContactInfo';
import OrganizationDetails from './OrganizationDetails';
import routes from '../../utils/routes.json';
import prospectService from '../../services/prospect.service';

const constants = stringConstants.deals.prospecting;

const ProspectingDetail = () => {
  const { contactId } = useParams();
  const history = useHistory();
  const [details, setDetails] = useState([]);
  const [prospect, setProspect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [charge, setCharge] = useState(false);

  const titleDefault = pageTitleBeautify([
    details?.first_name
      ? capitalize(details?.first_name) + ' ' + capitalize(details?.last_name)
      : '',
    'Deals',
  ]);

  const HeadingContact = ({ details }) => {
    let title = '';
    if (details?.first_name) {
      title = `${capitalize(details?.first_name)} ${capitalize(
        details?.last_name
      )}`;
    }

    return (
      <HeadingWithTitle title={title} useBc={true} showGreeting={false}>
        <div className="d-flex justify-content-end">
          <ButtonIcon
            label="Import Prospect"
            onclick={() => {
              showModal(details);
            }}
          />
        </div>
      </HeadingWithTitle>
    );
  };

  const showModal = (data) => {
    setOpenModal(true);
    setProspect(data);
  };

  const saveProspect = async () => {
    setLoading(true);
    const { company } = prospect;
    let company_id;

    if (company) {
      const {
        company_name,
        industry,
        revenue,
        fax_number,
        phone_number,
        domain,
        ticker,
        address,
        city,
        state,
        zip,
        country,
        sic_code,
        naics_code,
        id,
      } = company;

      const dataOrganization = {
        name: company_name,
        industry,
        annual_revenue: revenue,
        phone_fax: fax_number,
        phone_office: phone_number,
        website: domain,
        ticker_symbol: ticker,
        address_street: address,
        address_city: city,
        address_state: state,
        address_postalcode: zip,
        address_country: country,
        sic_code,
        naics_code,
        status: 'cold',
        external_id: id,
      };

      try {
        const { data } = await organizationService.createOrganization(
          dataOrganization
        );

        company_id = data.id;
      } catch (e) {
        setErrorMessage(stringConstants.settings.security.errorMessage);
        setLoading(false);
        return;
      }
    }

    const { id, first_name, last_name, email, state, city, title } = prospect;

    const dataContact = {
      first_name,
      last_name,
      email_home: email,
      title,
      primary_address_city: city,
      primary_address_state: state,
      status: 'cold',
      external_id: id,
      organization_id: company_id,
    };

    try {
      const { data } = await contactService.createContact(dataContact);

      history.push(`${routes.contacts}/${data.id}/profile`);
    } catch (error) {
      if (error?.response?.data?.code === 404) {
        setErrorMessage(error?.response?.data?.error);
      } else {
        setErrorMessage(stringConstants.settings.security.errorMessage);
      }
    }
    setLoading(false);
  };

  const getProspect = async () => {
    setCharge(true);

    try {
      const result = await prospectService.getProspectById(contactId);
      const {
        data: { data: prospect },
      } = result;

      const response = await prospectService.getCompanyByCriteria({
        domain: prospect.domain,
      });
      const {
        data: { data: company },
      } = response;
      const detailProspect = { ...prospect, company: { ...company } };

      setDetails(detailProspect);
    } catch (e) {
      console.log(e);
    } finally {
      setCharge(false);
    }
  };

  const getData = async () => {
    await getProspect();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={`pb-6`}>
      <Helmet>
        <title>{titleDefault}</title>
      </Helmet>
      <ModalConfirmDefault
        open={openModal}
        onHandleConfirm={saveProspect}
        onHandleClose={() => setOpenModal(false)}
        textBody={constants.importContactMessage}
        icon="person_add_alt"
        loading={loading}
        labelButtonConfirm={'Yes, Import'}
        iconButtonConfirm=""
        colorButtonConfirm={'outline-success'}
      />
      <AlertWrapper>
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      <HeadingContact details={details} />
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
              <Col xs={12} lg={6} className="mb-3">
                <ContactInfo details={details} />
              </Col>
              <Col xs={12} lg={6} className="mb-3">
                <OrganizationDetails company={details?.company} />
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
      <Card className={`mb-6`}>
        {details.company?.domain && (
          <ProspectList
            onHandleImport={showModal}
            domain={details.company?.domain}
          />
        )}
      </Card>
    </div>
  );
};

export default ProspectingDetail;
