export type ContactQuery = {
  id?: string; // contact id
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  employer?: string;
  title?: string;
  linkedin?: string;
  location?: string;
};

export type CompanyQuery = {
  id?: string; // company id
  name?: string;
  domain?: string;
  ticker?: string;
  linkedin?: string;
};

export type SearchQuery = {
  name?: string;
  keyword?: string;
  type?: string; // 'company' | 'contact';
  employer?: string;
  query?: any;
};

export type PersonSchema = {
  id?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  title?: string;
  profile_pic?: string;
  work_email?: string;
  work_phone?: string;
  city?: string;
  state?: string;
  country?: string;
  employer?: string;
  linkedin_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  location?: string;
  links?: [];
  teaser?: object;
};

export type CompanySchema = {
  id?: string;
  name?: string;
  description?: string;
  founded?: string;
  domain?: string;
  linkedin_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  location?: string;
  naics?: string;
  sic?: string;
  industry?: string;
  employees?: string;
  type?: string; // public | private
  ticker?: string;
  year_founded?: string;
  revenue?: string;
  logo_url?: string;
  phone?: string;
  links?: object;
};

export abstract class Prospect {
  service: string;

  constructor(service: string) {
    this.service = service;
  }

  abstract getContact(opts: ContactQuery): Promise<any>;
  abstract getCompany(opts: CompanyQuery): Promise<any>;
  abstract search(opts: any): Promise<any>;
}
