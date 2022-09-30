import axios from 'axios';

import authHeader from './auth-header';
import { PROSPECTS_FILTER_STORAGE_KEY } from '../utils/Utils';

const API_URL = '/api/prospects';

class ProspectService {
  getProspects(queryFilter, { page = 1, name = '', limit = 10 }) {
    const { filter, ...restProps } = queryFilter || {};

    const URL = `${API_URL}/${
      filter?.globalSearch ? 'quick-search' : 'prospector-pro-search'
    }?`;

    const params = {
      ...restProps,
      ...filter,
      page,
      regions: ['AMER'],
      countries: ['United States'],
      name: filter && filter?.name !== '' ? filter?.name : name,
      per_page: limit,
    };

    return axios
      .get(URL, {
        params,
        headers: authHeader(),
      })
      .then((response) => response)
      .catch((e) => console.log(e));
  }

  getProspectByCriteria(query) {
    const params = {
      ...query,
    };

    return axios
      .get(`${API_URL}/search`, {
        params,
        headers: authHeader(),
      })
      .then((response) => response)
      .catch((e) => console.log(e));
  }

  getProspectById(id) {
    const params = {
      id,
    };

    return axios
      .get(`${API_URL}/person-search`, {
        params,
        headers: authHeader(),
      })
      .then((response) => response)
      .catch((e) => console.log(e));
  }

  getCompanyByCriteria(query) {
    const params = {
      ...query,
    };

    return axios
      .get(`${API_URL}/company-search`, {
        params,
        headers: authHeader(),
      })
      .then((response) => response)
      .catch((e) => console.log(e));
  }

  getCompany(opts) {
    const params = {
      name: opts.name,
      location: 'USA', // default to always search USA
    };

    return axios
      .get(`${API_URL}/companies`, {
        params,
        headers: authHeader(),
      })
      .then((response) => response)
      .catch((e) => console.log(e));
  }

  async getCompanyRR(orgName) {
    const buildNewOrganizationObject = (rocketReachOrganization) => {
      return {
        name: rocketReachOrganization.name,
        employees: rocketReachOrganization.employees,
        address_street: rocketReachOrganization.address_street,
        annual_revenue:
          rocketReachOrganization.revenue ||
          rocketReachOrganization.annual_revenue,
        total_revenue:
          rocketReachOrganization.revenue ||
          rocketReachOrganization.annual_revenue,
        industry: rocketReachOrganization.industry,
        address_city: rocketReachOrganization.address_city,
        address_state: rocketReachOrganization.address_state,
        address_country: rocketReachOrganization.address_country,
        address_postalcode: rocketReachOrganization.address_postalcode,
        sic_code: '' + rocketReachOrganization.sic_code,
        naics_code:
          '' +
          (rocketReachOrganization.naics_code ||
            rocketReachOrganization.sic_code),
        ticker_symbol: rocketReachOrganization.ticker_symbol,
        avatar: rocketReachOrganization.logo,
        website: rocketReachOrganization.website,
        domain: rocketReachOrganization.website,
      };
    };

    const { data } = await this.getCompany({
      name: orgName,
    });

    if (data.error) {
      // for some company names RR sending error: true so for these create org with just name
      return { name: orgName };
    } else {
      const {
        name,
        industry,
        revenue,
        fax,
        phone,
        domain,
        ticker,
        address,
        city,
        country,
        postal_code,
        sic,
        naics,
        employees,
      } = data;

      const dataOrganization = {
        name,
        industry,
        annual_revenue: revenue + '',
        phone_fax: fax,
        phone_office: phone,
        website: domain,
        ticker_symbol: ticker,
        address_street: address,
        address_city: city,
        address_state: country,
        address_postalcode: postal_code,
        sic_code: sic,
        naics_code: naics || sic,
        employees,
        status: 'cold',
      };
      return buildNewOrganizationObject(dataOrganization);
    }
  }

  getContact(opts) {
    const params = opts;
    return axios
      .get(`${API_URL}/contacts`, {
        params,
        headers: authHeader(),
      })
      .then((response) => response)
      .catch((e) => console.log(e));
  }

  getCompanyEmployees(opts) {
    const params = {
      ...opts,
      type: 'people',
    };

    return axios
      .get(`${API_URL}/search`, {
        params,
        headers: authHeader(),
      })
      .then((response) => response)
      .catch((e) => console.log(e));
  }

  query(opts, { page = 1, limit = 10, type = 'query' }) {
    const body = {
      query: opts,
      type,
      page,
      limit,
    };

    return axios
      .post(`${API_URL}/search`, body, {
        headers: authHeader(),
      })
      .then((response) => response)
      .catch((e) => console.log(e));
  }

  // save filter search in localstorage for now, until its backend ready
  saveFilterSearch(type, filter) {
    let currentFilter =
      localStorage.getItem(PROSPECTS_FILTER_STORAGE_KEY) || null;

    if (!currentFilter) {
      currentFilter = '{}';
    }

    const parseFilter = JSON.parse(currentFilter);
    if (!parseFilter[type] || !filter) {
      parseFilter[type] = { ...filter };
    } else {
      parseFilter[type] = { ...parseFilter[type], ...filter };
    }

    localStorage.setItem(
      PROSPECTS_FILTER_STORAGE_KEY,
      JSON.stringify(parseFilter)
    );
  }

  getSavedFilters(type) {
    const currentFilter =
      localStorage.getItem(PROSPECTS_FILTER_STORAGE_KEY) || null;
    if (currentFilter) {
      const parsedFilter = JSON.parse(currentFilter);
      return parsedFilter[type];
    }
    return {};
  }
}

export default new ProspectService();
