import axios, { AxiosRequestConfig } from 'axios';
import { IAuthContext } from '../interfaces';

interface RetryConfig extends AxiosRequestConfig {
  retryDelay: number;
  _retry?: boolean;
}

export const generateAuthInterceptor = (authContext: IAuthContext) => {
  const protectedRequestConfig: RetryConfig = {
    retryDelay: 10,
    _retry: false,
  };

  const protectedRequests = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_API_HOST}/v1`,
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

      if (error.response.status === 401) {
        // unauthenticated, try to refresh tokens

        if (originalRequest._retry) {
          // already retried but still unauthenticated, sign out user
          authContext.signout();
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        const refreshToken = authContext.authState?.refreshToken;
        let authState = authContext.authState;

        if (refreshToken) {
          try {
            const resp = await axios.post(
              `${import.meta.env.VITE_BACKEND_API_HOST}/v1/auth/refresh`,
              { refreshToken: refreshToken },
            );
            if (resp.status === 201) {
              authState = resp.data;
            }
          } catch (e) {
            // refreshing tokens failed, sign out user
            authContext.signout();
            return Promise.reject(e);
          }

          originalRequest.headers.Authorization = `Bearer ${authState?.accessToken}`;

          const delayRetryRequest = new Promise<void>((resolve) => {
            setTimeout(() => {
              resolve();
            }, originalRequest.retryDelay);
          });

          // return promise to retry request after delay
          return delayRetryRequest.then(() => {
            authContext.signIn(authState!);
            return protectedRequests(originalRequest);
          });
        }
      } else {
        // user has no refresh token, sign out user
        authContext.signout();
        return Promise.reject(error);
      }
    },
  );
  return { protectedRequests, protectedRequestConfig };
};
