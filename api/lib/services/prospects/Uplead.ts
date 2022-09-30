import axios from 'axios';
import { Prospect } from './Prospect';

export class UpleadService extends Prospect {
  _url = "https://api.uplead.com";
  _apiKey = process.env.UPLEAD_APIKEY;

  constructor() {
    super('uplead');
  }

  async request(path: string, opts?:any): Promise<any> {
    return await axios.get(`${this._url}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': `${this._apiKey}`,
      }
    })
  }

  async getContact(opts?: any): Promise<any> {
    
    return Promise.resolve({});
  }

  async getCompany(opts?: any): Promise<any> {
    return Promise.resolve({});
  }

  async search(opts: any): Promise<any> {
    return Promise.resolve({});
  }

}