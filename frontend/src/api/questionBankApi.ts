import { IAuthContext } from '../interfaces';
import { backendServicesPaths, HttpRequestMethod } from '../utils/constants';
import { requestBackend } from './apiUtils';

// TODO: remove this API call
// This API shows how to use the auth interceptor
export async function pingProtectedBackend(authContext: IAuthContext) {
  return requestBackend({
    path: backendServicesPaths.question.pingAuth,
    authContext,
    method: HttpRequestMethod.GET,
  });
}

export async function pingPublicBackend() {
  return requestBackend({
    path: backendServicesPaths.question.root,
    method: HttpRequestMethod.GET,
  });
}
