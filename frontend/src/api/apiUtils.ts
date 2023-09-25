import axios, { AxiosRequestConfig } from 'axios';
import { IAuth, IAuthContext } from '../interfaces';
import { RequestBackendParams } from '../types';
import {
  backendServicesPaths,
  BACKEND_API_HOST,
  HttpRequestMethod,
  VERSION_PREFIX,
} from '../utils/constants';

// sets a global variable which we can await so that we don't send multiple refresh requests
let refreshingFunc: undefined | Promise<IRefreshTokenResponse> = undefined;

interface RetryConfig extends AxiosRequestConfig {
  retry?: boolean;
}

interface IRefreshTokenResponse {
  data: IAuth;
  status: number;
}

export const getBackendPath = (path?: string) =>
  `${BACKEND_API_HOST}${VERSION_PREFIX}${path ?? ''}`;

const refreshAccessToken = async (refreshToken: string) =>
  await axios
    .post(getBackendPath(backendServicesPaths.auth.refresh), {
      refreshToken: refreshToken,
    })
    .then((resp) => resp as IRefreshTokenResponse);

/**
 * Wrapper around axios to make requests to the backend.
 * @param authContext - the auth context to use for the request, providing this will trigger an authenticated request
 * @param path - the path to the backend service
 * @param method - the HTTP method to use
 * @param data - the data to send in the request body, for POST, PUT, and PATCH requests
 *  */
export function requestBackend(requestParams: RequestBackendParams) {
  let config = {};

  // generate axios instance to handle public requests
  let axiosInstance = axios.create({
    baseURL: getBackendPath(),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (requestParams.authContext) {
    const { protectedRequests, protectedRequestConfig } = generateAuthInterceptor(
      requestParams.authContext,
    );
    axiosInstance = protectedRequests;
    config = protectedRequestConfig;
  }

  if (requestParams.method == HttpRequestMethod.POST) {
    const data = requestParams.data;
    return axiosInstance.post(requestParams.path, data, config);
  }

  if (requestParams.method == HttpRequestMethod.PUT) {
    const data = requestParams.data;
    return axiosInstance.put(requestParams.path, data, config);
  }

  if (requestParams.method == HttpRequestMethod.GET) {
    return axiosInstance.get(requestParams.path, config);
  }

  if (requestParams.method == HttpRequestMethod.DELETE) {
    return axiosInstance.delete(requestParams.path, config);
  }

  if (requestParams.method == HttpRequestMethod.PATCH) {
    return axiosInstance.patch(requestParams.path, config);
  }

  throw new Error('Invalid HTTP request method');
}

// The auth interceptor is used to intercept requests to the backend and add the access token to the request.
// In the event that the access token is expired, the interceptor will attempt to refresh the access token.
export const generateAuthInterceptor = (authContext: IAuthContext) => {
  const protectedRequestConfig: RetryConfig = {
    retry: false,
  };

  const protectedRequests = axios.create({
    baseURL: getBackendPath(),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  protectedRequests.interceptors.request.use(function (config) {
    // add authorization header to all requests
    const accessToken = authContext.authState?.accessToken;

    if (accessToken && !config.headers.Authorization) {
      // do not overwrite existing authorization header if it exists as it may be a retry request
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    } else {
      return config;
    }
  });

  protectedRequests.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;

      if (error.response.status !== 401) {
        // not an auth error, return error
        return Promise.reject(error);
      }

      if (originalRequest.retry === true) {
        // we have already retried once, sign out user
        authContext.signout();
        return Promise.reject(error);
      }

      originalRequest.retry = true;
      const refreshToken = authContext.authState?.refreshToken;
      let authState = authContext.authState;

      if (!refreshToken) {
        // user has no refresh token, sign out user
        authContext.signout();
        return Promise.reject(error);
      }

      try {
        if (!refreshingFunc) {
          refreshingFunc = refreshAccessToken(refreshToken);
        }
        const resp = await refreshingFunc;

        if (resp.status === 201) {
          authState = resp.data;
        }
      } catch (e) {
        // refreshing tokens failed, sign out user
        authContext.signout();
        return Promise.reject(e);
      } finally {
        refreshingFunc = undefined;
      }

      originalRequest.headers.Authorization = `Bearer ${authState?.accessToken}`;
      authContext.signIn(authState!);

      return await protectedRequests(originalRequest);
    },
  );
  return { protectedRequests, protectedRequestConfig };
};
