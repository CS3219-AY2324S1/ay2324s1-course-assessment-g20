import { IQuestion } from '../interfaces';
import { HttpRequestMethod, backendServicesPaths } from '../utils/constants';
import { requestBackend } from './requestBackend';

export async function getSessionAndWsTicket(sessionId: string) {
  return requestBackend<{ question: IQuestion; ticket: string }>({
    url: `${backendServicesPaths.collaboration.getSessionAndWsTicket}/${sessionId}`,
    method: HttpRequestMethod.GET,
  });
}
