import axios from 'axios';
import { errorsRedirectHandler } from '../utils/Utils';

export default class BaseRequestService {
  async request(fn, flags = {}) {
    try {
      const result = await fn;

      if (!result.status && flags.errorsRedirect) {
        return errorsRedirectHandler(result);
      }

      return flags.fullResponse ? result : result.data;
    } catch (error) {
      if (flags.errorsRedirect) {
        errorsRedirectHandler(error);
      }
    }
  }

  async get(url, config, { fullResponse = false, errorsRedirect = true } = {}) {
    const promise = axios.get(url, config);
    return this.request(promise, { fullResponse, errorsRedirect });
  }

  async post(
    url,
    data,
    config,
    { fullResponse = false, errorsRedirect = true } = {}
  ) {
    const promise = axios.post(url, data, config);
    return this.request(promise, { fullResponse, errorsRedirect });
  }

  async delete(
    url,
    config,
    { fullResponse = false, errorsRedirect = true } = {}
  ) {
    const promise = axios.delete(url, config);
    return this.request(promise, { fullResponse, errorsRedirect });
  }

  async patch(
    url,
    data,
    config,
    { fullResponse = false, errorsRedirect = true } = {}
  ) {
    const promise = axios.patch(url, data, config);
    return this.request(promise, { fullResponse, errorsRedirect });
  }

  async put(
    url,
    data,
    config,
    { fullResponse = false, errorsRedirect = true } = {}
  ) {
    const promise = axios.put(url, data, config);
    return this.request(promise, { fullResponse, errorsRedirect });
  }
}
