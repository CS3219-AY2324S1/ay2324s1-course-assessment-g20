import { CreatedUser } from '../@types/auth';
import { HttpRequestMethod, backendServicesPaths } from '../utils/constants';
import { requestBackend } from './requestBackend';

export async function createUser(name: string) {
  return requestBackend<CreatedUser>({
    url: backendServicesPaths.auth.createUser,
    method: HttpRequestMethod.POST,
    data: { name },
  });
}
