import { IAuthContext } from '../interfaces';
import { generateAuthInterceptor } from './authUtils';

// TODO: remove this API call
// This API shows how to use the auth interceptor
export async function pingBackend(authContext: IAuthContext) {
  const { protectedRequests, protectedRequestConfig } = generateAuthInterceptor(authContext);

  return protectedRequests.get('/ping-auth', protectedRequestConfig);
}
