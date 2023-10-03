import { IwsTicket } from '../interfaces';
import { backendServicesPaths, HttpRequestMethod } from '../utils/constants';
import { requestBackend } from './requestBackend';

export async function getMatchingTicket() {
  return requestBackend<IwsTicket>({
    url: backendServicesPaths.matching.ticket,
    method: HttpRequestMethod.GET,
  });
}
