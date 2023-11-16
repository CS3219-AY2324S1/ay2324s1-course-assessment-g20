import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';
import _ from 'lodash';
import baseAxiosConfig from './baseAxiosConfig';
import { getBackendPath } from '../../utils/api';
import { backendServicesPaths } from '../../utils/constants';
import { IAuth, IAuthContext } from '../../@types/auth';

interface RetryConfig extends AxiosRequestConfig {
  retry?: boolean;
}

interface IRefreshTokenResponse {
  data: IAuth;
  status: number;
}

/**
 * Request and response interceptors are set in the useLayoutEffect inside AuthProvider.
 * This is intentional as we are using React Contexts to store our auth state, and not in an external
 * store such as Redux. All auth state related changes should be done via the AuthProvider interface.
 * However, we are unable to access the values in React Contexts before the provider is rendered.
 * This means we have to set the axios interceptors within the AuthProvider itself, and update them with
 * the latest context values when they change.
 */
const authorizedAxios = axios.create(baseAxiosConfig);

export const getRequestInterceptor =
  (authContextValue: IAuthContext) =>
  (axiosRequestConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = authContextValue.getAuthStore()?.accessToken;
    if (!accessToken) {
      throw Error('Access token not found!');
    }
    if (accessToken && !axiosRequestConfig.headers.Authorization) {
      // do not overwrite existing authorization header if it exists as it may be a retry request
      axiosRequestConfig.headers.Authorization = `Bearer ${accessToken}`;
    }
    return axiosRequestConfig;
  };

let refreshingFunc: undefined | Promise<IRefreshTokenResponse> = undefined;
const refreshAccessToken = async (refreshToken: string) =>
  await axios
    .post(getBackendPath(backendServicesPaths.auth.refresh), {
      refreshToken: refreshToken,
    })
    .then((resp) => resp as IRefreshTokenResponse);

export const getResponseInterceptors = (
  authContextValue: IAuthContext,
): [
  (axiosRespose: AxiosResponse) => AxiosResponse,
  (error: AxiosError) => Promise<AxiosResponse>,
] => [
  (resp) => resp,
  async (error) => {
    const originalRequestConfig = error.config as RetryConfig;

    // Not an unauthorized error, return error
    if (error.response?.status !== HttpStatusCode.Unauthorized) {
      return Promise.reject(error);
    }

    // If we have already retried refresh token flow once, sign out user
    if (originalRequestConfig.retry === true) {
      authContextValue.signout();
      return Promise.reject(error);
    }

    originalRequestConfig.retry = true;
    const refreshToken = authContextValue.getAuthStore()?.refreshToken;

    // If user has no refresh token, sign out user
    if (!refreshToken) {
      authContextValue.signout();
      return Promise.reject(error);
    }

    let authState: IAuth | null = null;
    try {
      if (!refreshingFunc) {
        refreshingFunc = refreshAccessToken(refreshToken);
      }
      const resp = await refreshingFunc;

      if (resp.status === HttpStatusCode.Created) {
        authState = resp.data;
        authContextValue.signIn(authState!);
      }
    } catch (e) {
      // refreshing tokens failed, sign out user
      authContextValue.signout();
      return Promise.reject(e);
    } finally {
      refreshingFunc = undefined;
    }

    const retryRequestConfig = _.cloneDeep(originalRequestConfig);
    retryRequestConfig.headers!.Authorization = `Bearer ${authState?.accessToken}`;

    return await authorizedAxios(retryRequestConfig);
  },
];

export default authorizedAxios;
