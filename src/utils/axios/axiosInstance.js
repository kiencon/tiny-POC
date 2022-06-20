/* eslint-disable class-methods-use-this */
import axios from 'axios';
import { API_ROOT } from '../../components/common/const';
import Cookies from '../cookies';

class AxiosService {
  constructor() {
    this.instance = axios.create({
      headers: this._getHeaders(),
    });

    this.instance.interceptors.request.use(
      this._interceptBeforeRequest,
      this._interceptRequestError,
    );

    this.instance.interceptors.response.use(
      this._interceptResponseData,
      this._interceptResponseError,
    );
  }

  _getHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  async _interceptBeforeRequest(config) {
    const cloneConfig = { ...config };

    if (!config.url) {
      return Promise.reject(new Error('[AxiosService] URL must not be blank'));
    }

    const authToken = Cookies.get('auth_token') || localStorage.getItem('auth_token');
    if (authToken) {
      cloneConfig.headers.authorization = `Bearer ${authToken}`;
    }

    // handle request multiple domains
    const { url } = config;
    if (url.indexOf('http') !== 0) {
      cloneConfig.url = API_ROOT + url;
    }

    return cloneConfig;
  }

  _interceptRequestError(error) {
    // Do something with request error
    return Promise.reject(error);
  }

  _interceptResponseData(response) {
    // Do something with response data
    return response;
  }

  _interceptResponseError(error) {
    // Do something with response error
    return Promise.reject(error);
  }

  get(url = '/', params = {}, config = {}) {
    return this.instance.get(url, {
      params,
      ...config,
      timestamp: new Date().getTime(),
    });
  }

  post(url = '/', data, config = {}) {
    return this.instance.post(url, data, config);
  }

  put(url = '/', data, config) {
    return this.instance.put(url, data, config);
  }

  patch(url = '/', data, config = {}) {
    return this.instance.patch(url, data, config);
  }

  delete(url = '/', params = {}, config = {}) {
    return this.instance.delete(url, { params }, config);
  }
}

const axiosInstance = new AxiosService();

export default axiosInstance;
