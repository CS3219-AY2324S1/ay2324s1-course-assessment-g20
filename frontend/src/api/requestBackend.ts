import { AxiosRequestConfig } from 'axios';
import unauthorizedAxios from './axios/unauthorizedAxios';
import authorizedAxios from './axios/authorizedAxios';

export function requestBackend<T>(
  requestParams: AxiosRequestConfig,
  useAuthentication: boolean = true,
) {
  if (!useAuthentication) {
    return unauthorizedAxios<T>(requestParams);
  }
  return authorizedAxios<T>(requestParams);
}
