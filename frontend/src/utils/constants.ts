// consolidated env vars
export const BACKEND_API_HOST = import.meta.env.VITE_BACKEND_API_HOST;

// api service endpoints
export const QUESTION = '/question';
export const VERSION_PREFIX = '/v1';

export const backendServicesPaths = {
  question: {
    root: QUESTION,
    questions: `${QUESTION}/questions`,
    difficulties: `${QUESTION}/difficulties`,
    categories: `${QUESTION}/categories`,
  },
};

export enum HttpRequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}
