// consolidated env vars
export const BACKEND_API_HOST = import.meta.env.VITE_BACKEND_API_HOST;

// api service endpoints
export const AUTH = '/auth';
export const USER = '/user';
export const LANGUAGES = '/languages';
export const QUESTION = '/question';
export const VERSION_PREFIX = '/v1';

export const backendServicesPaths = {
  auth: {
    root: `${AUTH}`,
    createUser: `${AUTH}/createUser`,
  },
  question: {
    root: QUESTION,
    questions: `${QUESTION}/questions`,
    difficulties: `${QUESTION}/difficulties`,
    categories: `${QUESTION}/categories`,
  },
  user: {
    root: USER,
  },
  languages: {
    root: LANGUAGES,
  },
};

export enum HttpRequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}
