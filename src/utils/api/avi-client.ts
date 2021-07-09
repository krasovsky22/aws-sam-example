import axios, { AxiosInstance } from 'axios';

export type ResponseType<T extends unknown> = {
  success: boolean;
  data?: T;
  message?: string;
};

export interface Client {
  get<T extends unknown>(options?: object): Promise<ResponseType<T>>;
  get<T extends unknown>(url: string, options?: object): Promise<ResponseType<T>>;
}

type AviClientProps = { endpoint?: string };

const STATUS_SUCCESS = 200;

class AviClient implements Client {
  protected api: AxiosInstance;

  constructor({ endpoint = '' }: AviClientProps) {
    const baseUrl = `${process.env?.AVI_URL ?? ''}${endpoint}`.replace(/\/$/, '');
    this.api = axios.create({
      baseURL: baseUrl,
      timeout: +(process.env?.AVI_TIMEOUT ?? 10000),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  public async get<T>(options?: object): Promise<ResponseType<T>>;
  public async get<T>(url: string, options?: object): Promise<ResponseType<T>>;
  public async get<T>(arg1?: unknown, arg2?: unknown): Promise<ResponseType<T>> {
    try {
      let response;
      if (typeof arg1 === 'string') {
        response = await this.api.get(arg1, arg2);
      } else {
        response = await this.api.get('', arg1);
      }

      if (response.status !== STATUS_SUCCESS) {
        console.error(response);
        return { success: false, message: response.data };
      }

      return { success: true, data: response.data as T };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { success: false, message: error.message };
      }
      console.error(error);
    }
  }
}

export default AviClient;

// class Client {
//   constructor({ endpoint = '' }) {
//     this.api = axios.create({
//       baseURL: `${Client._baseUrl}/${endpoint}`,
//       timeout: process.env.AVI_TIMEOUT || 10000,
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       },
//     });
//     this.endpoint = endpoint;
//   }
//
//   static setBaseUrl(url) {
//     // Trim trailing slash to uniform urls
//     Client._baseUrl = url.replace(/\/$/, '');
//   }
//
//   getPath(path, options = {}) {
//     const { params } = options;
//     const cacheKey = this.getCacheKey({ path, params });
//
//     return cache
//       .getOrSet(
//         cacheKey,
//         () => this.api.get(path, options).then(({ data, status }) => ({ data, status })),
//         null,
//         params,
//       )
//       .then(({ data, status }) => {
//         // If the response isn't 200 we don't want to cache the response
//         // BioApi will respond with 206 sometimes when it errors but later respond with 200 for the same alteration
//         if (status !== 200) {
//           cache.remove(cacheKey);
//         }
//         return data;
//       })
//       .catch((err) => {
//         // Can return a few things so we wanna return those too
//         // https://github.com/axios/axios#handling-errors
//         cache.remove(cacheKey);
//         const { response } = err;
//         return Promise.reject(response && response.data ? { status: response.status, message: response.data } : err);
//       });
//   }
//
//   get(options = {}) {
//     return this.getPath('', options);
//   }
// }
//
// Client._baseUrl = '';
//
// module.exports = Client;
