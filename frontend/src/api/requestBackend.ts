import { AxiosError, AxiosRequestConfig } from 'axios';
import unauthorizedAxios from './axios/unauthorizedAxios';
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

export function requestBackend<T>(requestParams: AxiosRequestConfig) {
  return unauthorizedAxios<T>(requestParams).catch(handleRequestBackendError);
}
