import { AxiosError, AxiosRequestConfig } from 'axios';
import unauthorizedAxios from './axios/unauthorizedAxios';
import authorizedAxios from './axios/authorizedAxios';
import {
  DEFAULT_PEERPREP_BACKEND_ERROR,
  PeerprepBackendError,
  PeerprepBackendErrorDetails,
} from '../@types/PeerprepBackendError';

const handleRequestBackendError = (error: any) => {
  if (error instanceof AxiosError) {
    const e = error as AxiosError<PeerprepBackendErrorDetails>;
    throw new PeerprepBackendError(e.response?.data ?? DEFAULT_PEERPREP_BACKEND_ERROR);
  }
  throw new PeerprepBackendError(DEFAULT_PEERPREP_BACKEND_ERROR);
};

export function requestBackend<T>(
  requestParams: AxiosRequestConfig,
  useAuthentication: boolean = true,
) {
  if (!useAuthentication) {
    return unauthorizedAxios<T>(requestParams).catch(handleRequestBackendError);
  }
  return authorizedAxios<T>(requestParams).catch(handleRequestBackendError);
}
