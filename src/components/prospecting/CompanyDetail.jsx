import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import './style.css';
import stringConstants from '../../utils/stringConstants.json';
import { capitalize, pageTitleBeautify } from '../../utils/Utils';
import ModalConfirmDefault from '../modal/ModalConfirmDefault';
import organizationService from '../../services/organization.service';
import AlertWrapper from '../Alert/AlertWrapper';
import Alert from '../Alert/Alert';
import ButtonIcon from '../commons/ButtonIcon';
import contactService from '../../services/contact.service';
import ProspectList from './ProspectList';
import prospectService from '../../services/prospect.service';
import CompanyInfo from './CompanyInfo';
import HeadingWithTitle from './HeadingWithTitle';
import routes from '../../utils/routes.json';

const constants = stringConstants.deals.prospecting;

const ProspectingDetail = () => {
  const { companyId } = useParams();
  const history = useHistory();
  const [details, setDetails] = useState({});
  const [prospect, setProspect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [type, setType] = useState(false);
  const [charge, setCharge] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const titleDefault = pageTitleBeautify([
    details?.company_name ? details?.company_name : '',
    'Deals',
  ]);

  const HeadingConctact = () => {
    let title = '';
    if (details?.company_name) {
      title = capitalize(details?.company_name);
    }

    return (
      <div>
        <HeadingWithTitle title={title} useBc={true} showGreeting={false}>
          <div className="d-flex justify-content-end">
            <ButtonIcon
              label="Import Organization"
              onclick={() => {
                showModal({ company: details }, false);
              }}
            />
          </div>
        </HeadingWithTitle>
      </div>
    );
  };

  const showModal = (data, isCompany = true) => {
    setType(isCompany);
    setOpenModal(true);
    setProspect(data);
  };

  const saveOrganization = async () => {
    setLoading(true);
    const { company } = prospect;

    try {
      const {
        data: { pagination },
      } = await organizationService.getOrganizations(
        {
          external_id: company?.id,
        },
        { limit: 10, page: 1 }
      );

      if (pagination?.count === 0) {
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
          history.push(`${routes.contacts}/${data.id}/organization/profile`);
        } catch (error) {
          if (error?.response?.data?.code === 404) {
            setErrorMessage(error?.response?.data?.error);
          } else {
            setErrorMessage(stringConstants.settings.security.errorMessage);
          }
        }
      } else {
        setErrorMessage(constants.organizationExist);
      }

      setLoading(false);
    } catch (e) {
      setErrorMessage(stringConstants.settings.security.errorMessage);
    }
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

  const getCompany = async () => {
    setCharge(true);
    try {
      const {
        data: { data },
      } = await prospectService.getCompanyByCriteria({ id: companyId });

      setDetails(data);
    } catch (e) {
      console.log(e);
    } finally {
      setCharge(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      await getCompany();
    };
    getData();
  }, []);

  return (
    <>
      <Helmet>
        <title>{titleDefault}</title>
      </Helmet>
      <ModalConfirmDefault
        open={openModal}
        onHandleConfirm={!type ? saveOrganization : saveProspect}
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
      <AlertWrapper>
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      {HeadingConctact()}
      <Card className="mb-5">
        <Card.Body>
          <Row className="w-100">
            {charge && (
              <div className="text-center w-100">
                <Spinner
                  animation="border"
                  className="ui-spinner-input my-3 text-primary"
                  variant="primary"
                />
              </div>
            )}
            {!charge && (
              <Col xs={12} className="mb-3">
                <CompanyInfo company={details} />
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>
      <Card>
        {details.domain && (
          <ProspectList onHandleImport={showModal} domain={details.domain} />
        )}
      </Card>
    </>
  );
};

export default ProspectingDetail;
