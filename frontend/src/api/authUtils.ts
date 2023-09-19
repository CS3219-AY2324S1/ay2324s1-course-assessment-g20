import axios, { AxiosRequestConfig } from 'axios';
import { IAuth, IAuthContext } from '../interfaces';
import { backendServicesPaths, BACKEND_API_HOST, VERSION_PREFIX } from '../utils/constants';

let refreshingFunc: undefined | Promise<IRefreshTokenResponse> = undefined;

interface RetryConfig extends AxiosRequestConfig {
  retry?: boolean;
}

interface IRefreshTokenResponse {
  data: IAuth;
  status: number;
}

const refreshAccessToken = async (refreshToken: string) =>
  await axios
    .post(`${BACKEND_API_HOST}${VERSION_PREFIX}${backendServicesPaths.auth.refresh}`, {
      refreshToken: refreshToken,
    })
    .then((resp) => resp as IRefreshTokenResponse);

// The auth interceptor is used to intercept requests to the backend and add the access token to the request.
// In the event that the access token is expired, the interceptor will attempt to refresh the access token.
export const generateAuthInterceptor = (authContext: IAuthContext) => {
  const protectedRequestConfig: RetryConfig = {
    retry: false,
  };

  const protectedRequests = axios.create({
    baseURL: `${BACKEND_API_HOST}${VERSION_PREFIX}`,
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
      }
      originalRequest.headers.Authorization = `Bearer ${authState?.accessToken}`;
      authContext.signIn(authState!);

      return await protectedRequests(originalRequest);
    },
  );
  return { protectedRequests, protectedRequestConfig };
};
