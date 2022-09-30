import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Card, Nav } from 'react-bootstrap';

import stringConstants from '../utils/stringConstants.json';
import MenuPeople from '../components/prospecting/v2/MenuPeople';
import MenuCompany from '../components/prospecting/v2/MenuCompany';
import TablePeopleProspect from '../components/prospecting/v2/common/TablePeopleProspect';
import prospectService from '../services/prospect.service';
import AlertWrapper from '../components/Alert/AlertWrapper';
import Alert from '../components/Alert/Alert';
import {
  initialState,
  initialStateCompany,
  ProspectTypes,
} from '../components/prospecting/v2/constants';
import routes from '../utils/routes.json';
import { useHistory } from 'react-router';
import MaterialIcon from '../components/commons/MaterialIcon';
import ImportProfile from '../components/organizationProfile/overview/ImportProfile';
import { useFilterProspectContext } from '../contexts/filterProspectContext';
import _ from 'lodash';
import BulkImportService from '../services/bulkImport.service';
import TableCompanyProspect from '../components/prospecting/v2/common/TableCompanyProspect';
import { generateCSV, getKeysWithData, scrollToTop } from '../utils/Utils';
import { TenantContext } from '../contexts/TenantContext';
import {
  checkPermission,
  PermissionsConstants,
} from '../utils/permissions.constants';
import ExportProfile from '../components/organizationProfile/overview/ExportProfile';

const ProspectSearch = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [prospects, setProspects] = useState([]);
  const [prospectsCompany, setProspectsCompany] = useState([]);
  const [paginationCompany, setPaginationCompany] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [filter, setFilter] = useState({});
  const [filterCompany, setFilterCompany] = useState({});
  const [loadFilterCompany, setLoadFilterCompany] = useState(0);
  const [loadFilterPeople, setLoadFilterPeople] = useState(0);
  const [firstRender, setFirstRender] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [currentProspect, setCurrentProspect] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const { tenant } = useContext(TenantContext);
  const [isAllowedExportImport, setIsAllowedExportImport] = useState(false);

  const checkForImportExport = () => {
    const { modules } = tenant;
    if (!modules || modules === '*') {
      setIsAllowedExportImport(true);
    } else {
      const modulesToCheck = checkPermission(modules, [
        PermissionsConstants.Resources.export,
        PermissionsConstants.Resources.import,
      ]);
      if (modulesToCheck.length) {
        setIsAllowedExportImport(true);
      }
    }
  };

  useEffect(() => {
    checkForImportExport();
  }, []);

  const {
    globalFilters,
    setGlobalFilters,
    globalFiltersCompany,
    setGlobalFiltersCompany,
  } = useFilterProspectContext();
  const [openModalImportProspects, setOpenModalImportProspects] =
    useState(false);
  const [openModalExportProspects, setOpenModalExportProspects] =
    useState(false);
  const [prospectsList, setProspectsList] = useState([]);

  const history = useHistory();
  useEffect(() => {
    // if this view opens from Load more button in org profile right bar
    // then get the employer name from params and open prospects search against it
    const currentEmployer = new URLSearchParams(history.location.search).get(
      'current_employer'
    );
    if (currentEmployer) {
      setActiveTab(0); // default to profile tab when switched from org right bar prospect
      setLoading(true);
      setFilter({ ...filter, current_employer: [currentEmployer] });
      setGlobalFilters({
        ...globalFilters,
        employer: {
          ...globalFilters.employer,
          current_employer: [currentEmployer],
        },
      });
      setLoadFilterPeople((prevState) => prevState + 1);
      scrollToTop();
    }
    return () => {
      // cleanup
      setGlobalFilters(initialState);
      setGlobalFiltersCompany(initialStateCompany);
    };
  }, [history.location]);

  const loadFiltersFromLocalStorage = () => {
    if (activeTab === 0) {
      const savedPeopleFilter = prospectService.getSavedFilters(
        ProspectTypes.people
      );
      if (!_.isEmpty(savedPeopleFilter)) {
        setFilter(getKeysWithData(savedPeopleFilter));
        setGlobalFilters({ ...savedPeopleFilter });
        setLoadFilterPeople((prevState) => prevState + 1);
      }
    } else {
      const savedCompanyFilter = prospectService.getSavedFilters(
        ProspectTypes.company
      );
      if (!_.isEmpty(savedCompanyFilter)) {
        setFilterCompany(getKeysWithData(savedCompanyFilter));
        setGlobalFiltersCompany({ ...savedCompanyFilter });
        setLoadFilterCompany((prevState) => prevState + 1);
      }
    }
  };

  const handleSelect = (tabKey) => {
    setActiveTab(Number(tabKey));
  };

  const NavMenu = () => {
    return (
      <Nav
        variant="tabs"
        className="w-100 d-flex border-bottom mx-0"
        onSelect={handleSelect}
      >
        <Nav.Item className="w-50 text-center">
          <Nav.Link
            as="span"
            className="py-3 fs-7 fw-bold"
            eventKey={0}
            active={activeTab === 0}
          >
            <MaterialIcon icon="group" /> People
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="w-50 text-center">
          <Nav.Link
            as="span"
            className="py-3 fs-7 fw-bold"
            eventKey={1}
            active={activeTab === 1}
          >
            <MaterialIcon icon="domain" /> Organization
          </Nav.Link>
        </Nav.Item>
      </Nav>
    );
  };

  const getProspects = async (page = 1) => {
    const limit = 10;
    if (!_.isEmpty(filter)) {
      setLoading(true);
      try {
        const response = await prospectService.query(
          { ...filter },
          {
            page: (page - 1) * limit + 1, // while sending RR set page * limit + 1 so it becomes 1, 11, 21, 31 etc.
            limit,
            type: 'query',
          }
        );
        setLoading(false);
        if (response.response?.status === 429) {
          setErrorMessage('Error getting prospects');
          throw new Error('Error getting prospects');
        }

        const profiles = response.data.data;
        const {
          pagination: { total, next },
        } = response.data;

        setProspects(profiles);

        // on response back converting to page number by dividing size, so it converts 11, 21 back to 1, 2 to highlight on pagination etc.
        const currentPage = (next - 1) / limit;
        setPagination({
          page: currentPage,
          next: next,
          total,
          totalPages: Math.ceil(total / 10),
        });
      } catch (e) {
        console.log(e);
        setErrorMessage('Error looking for prospects');
      }
    }
  };

  const getCompanyProspects = async (page = 1) => {
    const limit = 10;
    if (!_.isEmpty(filterCompany)) {
      setLoading(true);
      try {
        const response = await prospectService.query(
          { ...filterCompany },
          {
            page: (page - 1) * limit + 1, // while sending RR set page * limit + 1 so it becomes 1, 11, 21, 31 etc.
            limit,
            type: ProspectTypes.company,
          }
        );
        setLoading(false);

        if (response.response?.status === 429) {
          setErrorMessage('Error getting prospects');
          throw new Error('Error getting prospects');
        }

        const profiles = response.data.data;
        const {
          pagination: { total, nextPage },
        } = response.data;

        setProspectsCompany(profiles);

        // on response back converting to page number by dividing size, so it converts 11, 21 back to 1, 2 to highlight on pagination etc.
        const currentPage = (nextPage - 1) / limit;
        setPaginationCompany({
          page: currentPage,
          next: nextPage,
          total,
          totalPages: Math.ceil(total / 10),
        });
      } catch (e) {
        console.log(e);
        setErrorMessage('Error looking for prospects');
      }
    }
  };

  const onPageChangeCompany = (page) => {
    handleClearSelection();
    getCompanyProspects(page);
    scrollToTop();
  };

  const onPageChange = (page) => {
    handleClearSelection();
    getProspects(page);
    scrollToTop();
  };

  useEffect(() => {
    if (
      firstRender &&
      JSON.stringify(filter) !== JSON.stringify(initialState)
    ) {
      handleClearSelection();
      getProspects();
    } else {
      setFirstRender(true);
    }
  }, [filter]);

  useEffect(() => {
    if (
      firstRender &&
      JSON.stringify(filterCompany) !== JSON.stringify(initialStateCompany)
    ) {
      handleClearSelection();
      getCompanyProspects();
    } else {
      setFirstRender(true);
    }
  }, [filterCompany]);

  useEffect(loadFiltersFromLocalStorage, [activeTab]);

  const onHandleEdit = (item) => {
    setCurrentProspect(item);
    setOpenModal(true);
  };

  const switchTabAndSearchByCompany = (item) => {
    history.push(`${routes.resources}?current_employer=${item.name}`);
  };

  const saveProspect = async () => {
    setLoadingImport(true);

    try {
      // this calls Rocket Reach to get company details by name
      const newOrg =
        currentProspect.organization ||
        (await prospectService.getCompanyRR(
          currentProspect.employer || currentProspect.current_employer
        ));

      const {
        id,
        state,
        city,
        title,
        work_email,
        work_phone,
        first_name,
        last_name,
        country,
        profile_pic,
      } = currentProspect;

      const dataContact = {
        first_name,
        last_name: last_name || first_name,
        email_work: work_email,
        title: title,
        avatar: profile_pic,
        primary_address_city: city,
        primary_address_state: state,
        country,
        phone_work: work_phone,
        status: 'cold',
        external_id: '' + id,
        organization: newOrg,
      };

      const finalRequest = {
        update_existing: true,
        contacts: [dataContact],
      };

      const service = new BulkImportService();
      const { contacts } = await service.bulkImport(finalRequest, 'people', {});

      setLoadingImport(false);
      setOpenModal(false);
      // redirecting to just imported contact profile
      history.push(`${routes.contacts}/${contacts[0].id}/profile`);
    } catch (error) {
      console.log(error);
      setErrorMessage(stringConstants.settings.security.errorMessage);
    } finally {
      setLoadingImport(false);
    }
  };

  const chargeFilter = (payload, action) => {
    setFilter(payload);
    if (action) {
      setLoading(false);
      if (action === 'CLEAR') {
        setFilter({});
        setProspects([]);
        // remove query params when switching tabs
        history.replace({
          search: '',
        });
        setGlobalFilters(initialState);
        prospectService.saveFilterSearch(ProspectTypes.people, null);
      }
    }
  };

  const onSearch = (e) => {
    if (e.keyCode === 13) {
      const { value } = e.target;
      let valueArray = value ? [value] : [];
      if (filter?.name?.length || globalFilters?.global?.name?.length) {
        valueArray = _.uniq([...filter.name, ...valueArray]);
      }
      setFilter({ ...filter, name: valueArray });
      setGlobalFilters({ ...globalFilters, global: { name: valueArray } });
      setLoadFilterPeople((prevState) => prevState + 1);
    }
  };

  const chargeFilterCompany = (payload, action) => {
    setFilterCompany(payload);
    if (action) {
      setLoading(false);
      if (action === 'CLEAR') {
        setFilterCompany({});
        setProspectsCompany([]);
        // remove query params when switching tabs
        history.replace({
          search: '',
        });
        setGlobalFiltersCompany(initialState);
        prospectService.saveFilterSearch(ProspectTypes.company, null);
      }
    }
  };

  const onSearchCompany = (e) => {
    if (e.keyCode === 13) {
      const { value } = e.target;
      let valueArray = value ? [value] : [];
      if (filter?.name?.length || globalFilters?.global?.name?.length) {
        valueArray = _.uniq([...filterCompany.name, ...valueArray]);
      }
      setFilterCompany({ ...filterCompany, name: valueArray });
      setGlobalFiltersCompany({
        ...globalFiltersCompany,
        global: { name: valueArray },
      });
      setLoadFilterCompany((prevState) => prevState + 1);
    }
  };

  const saveProspects = async () => {
    setLoadingImport(true);
    // ids of selected prospects
    const contactIds = [...selectedData];
    const requests = [];

    contactIds.forEach((id) => {
      // call RR to get contact detail of each prospect
      const currentProspect = _.find(prospects, { id: parseInt(id) });
      // if info is not already loaded, the call RR
      if (!currentProspect.emails_list && !currentProspect.phones_list) {
        requests.push(prospectService.getContact({ id }));
      } else {
        currentProspect.emails = currentProspect.emails_list;
        currentProspect.phones = currentProspect.phones_list;
        const myPromise = new Promise((resolve) => {
          resolve({ data: currentProspect });
        });
        requests.push(myPromise);
      }
    });

    const rocketReachContactsResponse = await Promise.all(requests);

    const contacts = await Promise.all(
      rocketReachContactsResponse.map(async (prospect) => {
        const { data } = prospect;
        const currentProspect = _.find(prospects, { id: data.id });
        const { id, state, city, title, first_name, last_name, country } =
          currentProspect;

        // this calls Rocket Reach to get company details by name
        const newOrganization =
          currentProspect.organization ||
          (await prospectService.getCompanyRR(
            data.employer || data.current_employer
          ));

        return {
          first_name,
          last_name: last_name || first_name,
          avatar: data.profile_pic,
          email_work: data?.emails?.length ? data.emails[0].email : '',
          title: title,
          primary_address_city: city,
          primary_address_state: state,
          country,
          phone_work: data?.phones?.length ? data.phones[0].number : '',
          status: 'cold',
          external_id: '' + id,
          organization: newOrganization,
        };
      })
    );

    const finalRequest = {
      update_existing: true,
      contacts,
    };

    const service = new BulkImportService();
    await service.bulkImport(finalRequest, 'people', {});

    handleClearSelection();
    setLoadingImport(false);
    setOpenModalImportProspects(false);
    history.push(`${routes.contacts}?tab=people`);
  };

  const exportProspects = async () => {
    setLoadingImport(true);
    // ids of selected prospects
    const contactIds = [...selectedData];
    const requests = [];

    contactIds.forEach((id) => {
      // call RR to get contact detail of each prospect
      const currentProspect = _.find(prospects, { id: parseInt(id) });
      // if info is not already loaded, the call RR
      if (!currentProspect.emails_list && !currentProspect.phones_list) {
        requests.push(prospectService.getContact({ id }));
      } else {
        currentProspect.emails = currentProspect.emails_list;
        currentProspect.phones = currentProspect.phones_list;
        const myPromise = new Promise((resolve) => {
          resolve({ data: currentProspect });
        });
        requests.push(myPromise);
      }
    });

    const rocketReachContactsResponse = await Promise.all(requests);

    const contacts = await Promise.all(
      rocketReachContactsResponse.map(async (prospect) => {
        const { data } = prospect;
        const currentProspect = _.find(prospects, { id: data.id });
        const {
          id,
          state,
          city,
          title,
          first_name,
          last_name,
          country,
          employer,
        } = currentProspect;

        return {
          first_name,
          last_name: last_name || first_name,
          avatar: data.profile_pic,
          email_work: data?.emails?.length ? data.emails[0].email : '',
          title: title,
          primary_address_city: city,
          primary_address_state: state,
          country,
          phone_work: data?.phones?.length ? data.phones[0].number : '',
          status: 'cold',
          external_id: '' + id,
          organization: employer,
          work_email: currentProspect.work_email,
          work_phone: currentProspect.work_phone,
        };
      })
    );

    const headers = [
      { label: 'FirstName', key: 'first_name' },
      { label: 'last_name', key: 'last_name' },
      { label: 'title', key: 'title' },
      { label: 'email_work', key: 'work_email' },
      { label: 'email_other', key: 'email_other' },
      { label: 'phone_work', key: 'work_phone' },
      { label: 'phone_mobile', key: 'phone_mobile' },
      { label: 'phone_home', key: 'phone_home' },
      { label: 'phone_other', key: 'phone_other' },
      { label: 'organization', key: 'organization' },
    ];

    generateCSV(headers, contacts, 'prospects');

    handleClearSelection();
    setLoadingImport(false);
    setOpenModalExportProspects(false);
  };

  const handleExportProspects = () => {
    const contactIds = [...selectedData];
    const selected = [];
    contactIds.forEach((val) => {
      const foundProspect = _.find(prospects, { id: parseInt(val) });
      if (foundProspect.employer) {
        selected.push(foundProspect);
      }
    });
    setProspectsList(selected);
    setOpenModalExportProspects(true);
  };

  const handleSelectedProspects = () => {
    const contactIds = [...selectedData];
    const selected = [];
    contactIds.forEach((val) => {
      const foundProspect = _.find(prospects, { id: parseInt(val) });
      if (foundProspect.employer) {
        selected.push(foundProspect);
      }
    });
    setProspectsList(selected);
    setOpenModalImportProspects(true);
  };

  const handleClearSelection = () => {
    setSelectAll(false);
    setSelectedData([]);
  };

  const handleSaveFilter = (type, filter) => {
    prospectService.saveFilterSearch(type, filter);
    setMessage('Filters are saved.');
  };

  return (
    <>
      <ImportProfile
        openImportModal={openModal}
        setOpenImportModal={setOpenModal}
        prospect={currentProspect}
        handleImport={saveProspect}
        loading={loadingImport}
      />
      <ImportProfile
        openImportModal={openModalImportProspects}
        setOpenImportModal={setOpenModalImportProspects}
        prospect={prospectsList}
        handleImport={saveProspects}
        multiple
        loading={loadingImport}
      />
      <ExportProfile
        openModal={openModalExportProspects}
        setOpenModal={setOpenModalExportProspects}
        prospect={prospectsList}
        handleExport={exportProspects}
        multiple
        loading={loadingImport}
      />
      <AlertWrapper>
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
        <Alert color="success" message={message} setMessage={setMessage} />
      </AlertWrapper>
      <Row className="w-100" noGutters>
        <Col xs={3}>
          <Card className="m-0">
            <Card.Header className="w-100 border-bottom-0 mx-0 px-0 py-0 mb-1">
              <NavMenu />
            </Card.Header>
            <Card.Body className="px-0 pt-0 pb-0">
              {activeTab === 0 ? (
                <MenuPeople
                  chargeFilter={chargeFilter}
                  saveFilter={() =>
                    handleSaveFilter(ProspectTypes.people, { ...globalFilters })
                  }
                  loadFilter={loadFilterPeople}
                />
              ) : (
                <MenuCompany
                  chargeFilter={chargeFilterCompany}
                  saveFilter={() =>
                    handleSaveFilter(ProspectTypes.company, {
                      ...globalFiltersCompany,
                    })
                  }
                  loadFilter={loadFilterCompany}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={9} className="p-0">
          <div className="ml-2">
            {activeTab === 0 ? (
              <TablePeopleProspect
                data={prospects}
                checkbox={isAllowedExportImport}
                pagination={pagination}
                selectAll={selectAll}
                setSelectAll={setSelectAll}
                selectedProspects={selectedData}
                setSelectedProspects={setSelectedData}
                importProspects={handleSelectedProspects}
                exportProspects={handleExportProspects}
                onSearch={onSearch}
                chargeFilter={chargeFilter}
                showLoading={loading}
                onPageChange={onPageChange}
                onHandleEdit={onHandleEdit}
                clearSelection={handleClearSelection}
              />
            ) : (
              <TableCompanyProspect
                data={prospectsCompany}
                checkbox={false}
                pagination={paginationCompany}
                selectAll={selectAll}
                setSelectAll={setSelectAll}
                selectedProspects={[]}
                setSelectedProspects={setSelectedData}
                importProspects={handleSelectedProspects}
                onSearch={onSearchCompany}
                chargeFilter={chargeFilterCompany}
                showLoading={loading}
                onPageChange={onPageChangeCompany}
                onHandleEdit={switchTabAndSearchByCompany}
                clearSelection={handleClearSelection}
              />
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ProspectSearch;
