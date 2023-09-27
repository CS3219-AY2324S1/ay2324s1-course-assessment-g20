import { AxiosRequestConfig } from 'axios';
import unauthorizedAxios from './axios/unauthorizedAxios';
import authorizedAxios from './axios/authorizedAxios';

export function requestBackend(
  requestParams: AxiosRequestConfig,
  useAuthentication: boolean = true,
) {
  if (!useAuthentication) {
    return unauthorizedAxios(requestParams);
  }
  return authorizedAxios(requestParams);
}
