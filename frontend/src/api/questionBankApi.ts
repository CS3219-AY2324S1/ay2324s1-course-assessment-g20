import { backendServicesPaths, HttpRequestMethod } from '../utils/constants';
import { requestBackend } from './requestBackend';

// TODO: remove this API call
// This API shows how to use the auth interceptor
export async function pingProtectedBackend() {
  return requestBackend({
    url: backendServicesPaths.question.pingAuth,
    method: HttpRequestMethod.GET,
  });
}

export async function pingPublicBackend() {
  return requestBackend(
    {
      url: backendServicesPaths.question.root,
      method: HttpRequestMethod.GET,
    },
    false,
  );
}
