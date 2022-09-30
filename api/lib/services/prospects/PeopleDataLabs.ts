import axios from 'axios';
import {
  Prospect,
  ContactQuery,
  CompanyQuery,
  SearchQuery,
  CompanySchema,
  PersonSchema,
} from './Prospect';

export class PeopleDataLabs extends Prospect {
  _url = 'https://api.peopledatalabs.com';
  _apiKey = process.env.PEOPLE_DATALABS_KEY;

  constructor() {
    super('peopledatalabs');
  }

  async request(path: string, opts?: any): Promise<any> {
    return await axios.get(`${this._url}${path}`, {
      params: opts,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': `${this._apiKey}`,
      },
    });
  }

  async getContact(opts: ContactQuery): Promise<any> {
    try {
      // https://docs.peopledatalabs.com/docs/identify-api-quickstart
      //
      const resp = await this.request('/v5/person/identify', {
        first_name: opts.first_name,
        last_name: opts.last_name,
        location: opts.location ? opts.location : 'USA',
      });

      if (resp.data.status !== 200) {
        return [];
      }

      let contacts: PersonSchema[] = [];
      resp.data.matches.map((person: any) => {
        const p: PersonSchema = {
          id: person.data.id,
          first_name: person.data.first_name,
          last_name: person.data.last_name,
          full_name: person.data.full_name,
          title: person.data.job_title,
          work_email: person.data.work_email,
          work_phone:
            person.data.phone_numbers.length > 0
              ? person.data.phone_numbers[0]
              : '',
          linkedin_url: person.data.linkedin_url,
          facebook_url: person.data.facebook_url,
          twitter_url: person.data.twitter_url,
          city: person.data.location_locality,
          state: person.data.location_region,
          country: person.data.location_country,
          employer: person.data.job_company_name,
        };

        contacts.push(p);
      });

      return { data: contacts };
    } catch (err) {
      console.log(err);
      return {
        error: true,
        data: [],
      };
    }
  }

  async getCompany(opts: CompanyQuery): Promise<any> {
    try {
      // https://docs.peopledatalabs.com/docs/company-enrichment-api
      const resp = await this.request('/v5/company/enrich', {
        ...opts,
      });

      if (resp.data.status != 200) {
        return {};
      }

      const company: CompanySchema = {
        id: resp.data.id,
        name: resp.data.name,
        description: resp.data.summary,
        founded: resp.data.founded,
        domain: resp.data.website,
        address: resp.data.location.street_address,
        city: resp.data.location.locality,
        state: resp.data.location.region,
        postal_code: resp.data.location.postal_code,
        country: resp.data.location.country,
        employees: resp.data.employee_count,
        linkedin_url: resp.data.linkedin_url,
        facebook_url: resp.data.facebook_url,
        twitter_url: resp.data.twitter_url,
        naics:
          resp.data.naics && resp.data.naics.length > 0
            ? resp.data.naics[0].naics_code
            : '',
        sic:
          resp.data.sic && resp.data.sic.length > 0
            ? resp.data.sic[0].sic_code
            : '',
        ticker: resp.data.ticker,
        type: resp.data.type,
        industry: resp.data.industry,
      };

      return company;
    } catch (err) {
      return {
        error: true,
      };
    }
  }

  async search(opts: any): Promise<any> {
    // https://docs.peopledatalabs.com/docs/search-api

    // DataLabs supports direct ElasticSearch queries
    let query;
    let path = '/v5/person/search';

    if (opts.type === 'company') {
      path = '/v5/company/search';
      query = { query: { term: { name: opts.name } } };
    } else {
      query = { query: { term: { job_company_name: opts.employer } }, size: 5 };
    }

    try {
      const resp = await this.request(path, {
        ...query,
      });

      if (resp.data.status !== 200) {
        return [];
      }

      const contacts: PersonSchema[] = [];
      resp.data.data.map((person: any) => {
        const p: PersonSchema = {
          id: person.id,
          first_name: person.first_name,
          last_name: person.last_name,
          full_name: person.full_name,
          title: person.job_title,
          work_email: person.work_email,
          work_phone:
            person.phone_numbers.length > 0 ? person.phone_numbers[0] : '',
          linkedin_url: person.linkedin_url,
          facebook_url: person.facebook_url,
          twitter_url: person.twitter_url,
          city: person.location_locality,
          state: person.location_region,
          country: person.location_country,
          employer: person.job_company_name,
        };

        contacts.push(p);
      });

      return contacts;
    } catch (err) {
      console.log(err);
      return {
        error: true,
      };
    }
  }
}
