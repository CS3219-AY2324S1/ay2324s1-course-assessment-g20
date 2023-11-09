import { IWsTicket } from '../@types/auth';
import { backendServicesPaths, HttpRequestMethod } from '../utils/constants';
import { requestBackend } from './requestBackend';

export async function getMatchingTicket() {
  return requestBackend<IWsTicket>({
    url: backendServicesPaths.auth.ticket,
    method: HttpRequestMethod.GET,
  });
}
