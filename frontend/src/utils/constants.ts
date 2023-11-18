// consolidated env vars
export const BACKEND_API_HOST = import.meta.env.VITE_BACKEND_API_HOST;
export const BACKEND_WEBSOCKET_HOST = import.meta.env.VITE_BACKEND_WEBSOCKET_HOST;

// api service endpoints
export const AUTH = '/auth';
export const USER = '/user';
export const LANGUAGES = '/languages';
export const QUESTION = '/question';
export const COLLABORATION = '/collaboration';
export const MATCHING = '/matching';
export const VERSION_PREFIX = '/v1';
export const CHATBOT = '/chatbot';

export const backendServicesPaths = {
  auth: {
    root: `${AUTH}`,
    refresh: `${AUTH}/refresh`,
    googleRedirect: `${AUTH}/google`,
    ticket: `${AUTH}/ticket`,
  },
  question: {
    root: QUESTION,
    questions: `${QUESTION}/questions`,
    difficulties: `${QUESTION}/difficulties`,
    categories: `${QUESTION}/categories`,
    getQuestionsByDifficulty: (difficultyId: string) =>
      `${QUESTION}/questions/difficulty/${difficultyId}`,
  },
  user: {
    root: USER,
    userAttempts: `${USER}/attempts`,
  },
  languages: {
    root: LANGUAGES,
  },
  collaboration: {
    root: COLLABORATION,
    getSession: `${COLLABORATION}/session`,
    getSessionAttempt: (sessionId: string) => `${COLLABORATION}/session/${sessionId}/attempt`,
    getSessionTicket: (sessionId: string) => `${COLLABORATION}/session/${sessionId}/ticket`,
  },
  matching: {
    root: MATCHING,
  },
  chatbot: {
    root: CHATBOT,
    query: `${CHATBOT}/query`,
    history: `${CHATBOT}/history`,
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
