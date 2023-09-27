import { BACKEND_API_HOST, VERSION_PREFIX } from './constants';

export const getBackendPath = (path?: string) =>
  `${BACKEND_API_HOST}${VERSION_PREFIX}${path ?? ''}`;
