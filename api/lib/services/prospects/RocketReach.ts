import axios from 'axios';
import {
  Prospect,
  ContactQuery,
  CompanyQuery,
  PersonSchema,
  CompanySchema,
} from './Prospect';

export class RocketReachService extends Prospect {
  _url = 'https://api.rocketreach.co';
  _apiKey = process.env.ROCKET_API_KEY;

  constructor() {
    super('rocketreach');
  }

  async request(path: string, opts?: any): Promise<any> {
    return await axios.get(`${this._url}${path}`, {
      params: opts,
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': `${this._apiKey}`,
      },
    });
  }

  serializeContact(person: any): PersonSchema {
    let p: PersonSchema = { id: '' };

    // lets filter contacts without name
    if (!person.name) {
      return p;
    }

    const nameParts = person.name.split(' ');
    p = {
      id: person.id,
      full_name: person.name,
      first_name: nameParts[0],
      last_name: nameParts[1],
      title: person.current_title,
      profile_pic: person.profile_pic,
      work_email:
        person.teaser.emails?.length > 0 ? person.teaser.emails[0] : '',
      work_phone:
        person.teaser.phones.length > 0 ? person.teaser.phones[0].number : '',
      linkedin_url: person.linkedin_url,
      //facebook_url: person.facebook_url,
      //twitter_url: person.twitter_url,
      city: person.city,
      state: person.region,
      country: person.country_code,
      employer: person.current_employer,
      location: person.location,
      links: person.links,
      teaser: person.teaser,
    };

    return p;
  }

  serializeCompany(company: any): CompanySchema {
    return {
      id: company?.id,
      name: company?.name,
      description: company?.description,
      founded: company?.year_founded,
      domain: company?.email_domain || company?.website_domain,
      address: company?.address?.street,
      city: company?.city || company?.address?.city,
      state: company?.address?.region,
      postal_code: company?.address?.postal_code,
      country: company?.country_code || company?.address?.country_code,
      employees: company?.num_employees,
      linkedin_url: company?.links?.linkedin,
      facebook_url: company?.links?.facebook,
      twitter_url: company?.links?.twitter,
      //naics: (resp.data.naics && resp.data.naics.length > 0) ? resp.data.naics[0].naics_code:'',
      sic:
        company?.sic_codes && company?.sic_codes?.length > 0
          ? company?.sic_codes[0]
          : '',
      ticker: company?.ticker_symbol,
      industry: company?.industry_str || company?.industry,
      year_founded: company?.year_founded,
      revenue: company?.revenue,
      logo_url: company?.logo_url,
      phone: company?.phone,
      links: company?.links,
    };
  }

  async getContact(opts: ContactQuery): Promise<any> {
    try {
      // https://rocketreach.co/api?section=api_section_ws_lookupContact
      // name and current_employer are required
      let query: any = { name: opts.name };

      if (opts.employer) {
        query.current_employer = opts.employer;
      }

      if (opts.id) {
        query = { id: opts.id };
      }
      const resp = await this.request('/api/v2/lookupProfile', query);

      return resp.data;
    } catch (err) {
      return {
        error: true,
      };
    }
  }

  async getCompany(opts: CompanyQuery): Promise<any> {
    try {
      // https://rocketreach.co/api?section=api_section_ws_lookupCompany
      const resp = await this.request('/api/v2/lookupCompany', {
        ...opts,
      });

      return this.serializeCompany(resp.data);
    } catch (err) {
      return {
        error: true,
      };
    }
  }

  /**
   * Using the /searchCompany API
   * https://rocketreach.co/api?section=api_section_ws_searchCompany
   *
   * @param opts SearchQuery
   * @returns
   */
  async searchCompany(opts: any): Promise<any> {
    const results: any = { data: [], pagination: {} };
    const { page, limit } = opts;

    // always default to US if not location is found.
    if (!opts.query.location) {
      opts.query.location = ['US'];
    }

    const payload = {
      query: opts.query,
      start: page,
      page_size: limit,
    };
    let resp;
    try {
      resp = await axios.post(`${this._url}/api/v2/searchCompany`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': `${this._apiKey}`,
        },
      });
    } catch (err) {
      return results;
    }

    if (resp && resp.status !== 201) {
      return results;
    }

    const lookupCompanyRequests: Promise<any>[] = [];
    resp.data.companies.map((org: any) => {
      // since this api only sends name/id/location
      // we also need each company details so we have to call lookupCompany one by one on it
      lookupCompanyRequests.push(this.getCompany({ id: org.id }));
    });

    const companiesData = await Promise.all(lookupCompanyRequests);
    // filtering out those companies against which RR sends error
    results.data = companiesData.filter((company) => !company.error);
    results.pagination = resp.data.pagination;

    return results;
  }

  /**
   * Using the /search API
   * https://rocketreach.co/api?section=api_section_ws_search
   *
   * @param opts SearchQuery
   * @returns
   */
  async search(opts: any): Promise<any> {
    // added exclude query for RR, just to avoid those contacts which dont have employer
    // TODO: will turn off this when we have organization select at import modal
    const excludedQuery = {
      exclude_current_title: ['Retired', 'Disabled', 'Unemployed'],
      exclude_current_employer: ['null'], // sending null here so that we dont show these profiles for now
    };
    const { page, limit, query } = opts;

    if (!opts.type) {
      opts.type = 'query';
    }

    if (opts.type == 'company') {
      return this.searchCompany(opts);
    }

    const payload = { query: {}, start: page, page_size: limit };
    if (opts.type === 'people') {
      if (query.employer) {
        // make sure we search by people in the US
        payload.query = {
          current_employer: [query.employer],
          location: query.location || ['USA'],
          ...excludedQuery,
        };
      } else if (query.name) {
        payload.query = {
          name: [query.name],
          location: query.location || ['USA'],
          ...excludedQuery,
        };
      }
    } else if (opts.type === 'query') {
      payload.query = opts.query;
      payload.query = {
        ...payload.query,
        location: query.location || ['USA'],
        ...excludedQuery,
      };
    }

    try {
      const resp = await axios.post(`${this._url}/api/v2/search`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': `${this._apiKey}`,
        },
      });

      if (resp.status !== 201) {
        return [];
      }

      let results: any = [];
      const contacts: PersonSchema[] = [];
      resp.data.profiles.map((person: any) => {
        const p: PersonSchema = this.serializeContact(person);
        if (p.id != '') {
          contacts.push(p);
        }
      });

      results = contacts;

      if (opts.type === 'query') {
        return {
          data: results,
          pagination: resp.data.pagination,
        };
      }

      return results;
    } catch (err) {
      return {
        error: true,
      };
    }
  }
}
