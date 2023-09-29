// consolidated env vars
export const BACKEND_API_HOST = import.meta.env.VITE_BACKEND_API_HOST;

// api service endpoints
export const AUTH = '/auth';
export const QUESTION = '';
export const USER = '/user';
export const LANGUAGES = '/languages';
export const VERSION_PREFIX = '/v1';

export const backendServicesPaths = {
  auth: {
    root: `${AUTH}`,
    refresh: `${AUTH}/refresh`,
    googleRedirect: `${AUTH}/google`,
  },
  question: {
    root: QUESTION,
    pingAuth: `${QUESTION}/ping-auth`, // TODO: remove this API call
  },
  user: {
    root: USER,
  },
  languages: {
    root: LANGUAGES,
  },
};

// other constants
export const AUTH_TOKEN_LOCAL_STORAGE_KEY = 'authState';

export enum HttpRequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}

export const languages = {
  javascript: 'javascript',
  typescript: 'typescript',
};
