import { IAttempt } from '../@types/history';
import { HttpRequestMethod, backendServicesPaths } from '../utils/constants';
import { requestBackend } from './requestBackend';

export async function getAttemptsByUsername(username: string) {
  return requestBackend<IAttempt[]>({
    url: `${backendServicesPaths.history.attempts}/${username}`,
    method: HttpRequestMethod.GET,
  });
}
