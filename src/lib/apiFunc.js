import axios from 'axios';

export const APIKit = axios.create({
  baseURL: '/api',
});

const removeServerHeader = (headers) => {
  const modifiedHeaders = { ...headers };
  delete modifiedHeaders['Server'];
  return modifiedHeaders;
};

APIKit.interceptors.request.use((config) => {
  config.headers['X-Frame-Options'] = 'DENY';
  config.headers['Content-Security-Policy'] = 'default-src \'self\';';
  config.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  
  delete config.headers['X-Powered-By'];

  return config;
});

APIKit.interceptors.response.use(
  (response) => {
    response.headers = removeServerHeader(response.headers);

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default APIKit;