import axios from 'axios';
import { getTokenAsync } from './getToken';
import { url } from './urlApi';
import { ERROR } from '../constant/constant';

const instance = axios.create({
  baseURL: url,
});

instance.interceptors.request.use(async config => {
  try {
    const token = await getTokenAsync();
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['ngrok-skip-browser-warning'] = true;
    return config;
  } catch (error) {
    throw error;
  }
});

const get = (url: string, params?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    instance
      .get(url, { params })
      .then(response => {
        if (response?.data?.data) {
          resolve(response.data.data);
        } else {
          reject(ERROR);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

const post = (url: string, data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    instance
      .post(url, data)
      .then(response => {
        if (response) {
          resolve(response);
        } else {
          reject(ERROR);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

const put = (url: string, data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    instance
      .put(url, data)
      .then(response => {
        if (response) {
          resolve(response);
        } else {
          reject(ERROR);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

const del = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    instance
      .delete(url)
      .then(response => {
        if (response) {
          resolve(response);
        } else {
          reject(ERROR);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

export { get, post, put, del };
