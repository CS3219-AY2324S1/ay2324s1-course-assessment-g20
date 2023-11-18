import { IAttempt } from '../@types/history';
import { IQuestion } from '../@types/question';
import { HttpRequestMethod, backendServicesPaths } from '../utils/constants';
import { requestBackend } from './requestBackend';

export async function getSession(sessionId: string) {
  return requestBackend<{ question: IQuestion; otherUserUsername: string }>({
    url: `${backendServicesPaths.collaboration.getSession}/${sessionId}`,
    method: HttpRequestMethod.GET,
  });
}

export async function getSessionAttempt(sessionId: string) {
  return requestBackend<IAttempt>({
    url: backendServicesPaths.collaboration.getSessionAttempt(sessionId),
    method: HttpRequestMethod.GET,
  });
}

export function getSessionTicket(sessionId: string) {
  return requestBackend<{ ticket: string }>({
    url: backendServicesPaths.collaboration.getSessionTicket(sessionId),
    method: HttpRequestMethod.GET,
  });
}
