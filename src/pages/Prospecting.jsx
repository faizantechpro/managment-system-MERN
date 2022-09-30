import React, { useState } from 'react';
import { Card, Col, Image, Row } from 'react-bootstrap';
import { useHistory } from 'react-router';

import organizationService from '../services/organization.service';
import contactService from '../services/contact.service';
import FilterMenu from '../components/prospecting/FilterMenu';
import ModalConfirmDefault from '../components/modal/ModalConfirmDefault';
import AlertWrapper from '../components/Alert/AlertWrapper';
import Alert from '../components/Alert/Alert';
import ProspectList from '../components/prospecting/ProspectList';
import stringConstants from '../utils/stringConstants.json';
import routes from '../utils/routes.json';
import IconEmptySearch from '../assets/png/Icon Empty Search.png';
import { initialFilters } from '../components/prospecting/constants';

const constants = stringConstants.deals.prospecting;

const Prospecting = () => {
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const [prospect, setProspect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [finalCriteria, setFinalCriteria] = useState(null);

  const showModal = (data) => {
    setOpenModal(true);
    setProspect(data);
  };

  const saveProspect = async () => {
    setLoading(true);
    const { company } = prospect;
    let company_id;

    if (company) {
      const dataOrganization = {
        name: company.company_name,
        industry: company.industry,
        annual_revenue: company.revenue,
        phone_fax: company.fax_number,
        phone_office: company.phone_number,
        website: company.domain,
        ticker_symbol: company.ticker,
        address_street: company.address,
        address_city: company.city,
        address_state: company.state,
        address_postalcode: company.zip,
        address_country: company.country,
        sic_code: company.sic_code,
        naics_code: company.naics_code,
        status: 'cold',
        external_id: company?.id,
      };

      try {
        const { data } = await organizationService.createOrganization(
          dataOrganization
        );
        company_id = data.id;
      } catch (e) {
        setErrorMessage(stringConstants.settings.security.errorMessage);
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

  const saveOrganization = async () => {
    setLoading(true);
    const { id } = prospect;

    try {
      const {
        data: { pagination },
      } = await organizationService.getOrganizations(
        {
          external_id: id,
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
        } = prospect;

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
          history.push(`/contacts/${data.id}/organization/profile`);
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

  const applyFilter = (globalSearch) => {
    const { industry, title, location, revenue, employees, global } = filters;

    let industries = [];
    const industries_ids = [];

    // uplead api needs industries to be lower cased
    if (industry) {
      if (industry.industries.length !== 0) {
        industries = industry.industries.map((item) => item.toLowerCase());
      }

      Object.entries(industry.category).forEach(([, item]) => {
        if (item.length > 0) {
          const categoryItem = item.map((row) => row);
          industries_ids.push(...categoryItem);
        }
      });
    }

    const sic_codes = industry.sic_codes.filter((sic) => sic !== '');
    const naics_codes = industry.naics_codes.filter((naics) => naics !== '');
    const titles = title.titles.split(/\r?\n/);

    setFinalCriteria((prev) => ({
      ...industry,
      ...title,
      ...location,
      ...global,
      globalSearch: prev?.globalSearch || globalSearch,
      industries,
      industries_ids,
      category: null,
      sic_codes,
      naics_codes,
      titles,
      revenues: revenue.range,
      employees: employees.range,
    }));
  };

  const clearCriteria = () => {
    setFinalCriteria(null);
    setFilters(initialFilters);
  };

  return (
    <>
      <ModalConfirmDefault
        open={openModal}
        onHandleConfirm={!prospect?.company ? saveOrganization : saveProspect}
        onHandleClose={() => setOpenModal(false)}
        textBody={
          !prospect?.company
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
      {/* <Heading title={'Find Prospects'} useBc={true} /> */}
      <Row noGutters className="w-100">
        <Col xs={3}>
          <Card>
            <Card.Header>
              <h4>{constants.searchCriteriaLabel}</h4>
            </Card.Header>
            <Card.Body>
              <FilterMenu
                data={filters}
                setData={setFilters}
                onHandleDone={applyFilter}
              />
            </Card.Body>
            {finalCriteria && (
              <Card.Footer>
                <button
                  className="btn btn-outline-danger btn-block mb-2"
                  onClick={clearCriteria}
                >
                  <span className="material-icons-outlined mr-1">clear</span>
                  {constants.clearAllCriteriaLabel}
                </button>
              </Card.Footer>
            )}
          </Card>
        </Col>
        <Col xs={9} className="pl-4">
          {!finalCriteria ? (
            <div>
              <p className="text-center fs-4">
                <span className="material-icons-outlined fs-4">
                  keyboard_backspace
                </span>{' '}
                {constants.messageFilter}
              </p>
              <Image
                src={IconEmptySearch}
                className="d-flex m-auto with-search-icon "
              />
            </div>
          ) : (
            <ProspectList onHandleImport={showModal} filter={finalCriteria} />
          )}
        </Col>
      </Row>
    </>
  );
};

export default Prospecting;
