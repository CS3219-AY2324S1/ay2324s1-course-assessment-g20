import { IQuestion } from '../@types/question';
import { HttpRequestMethod, backendServicesPaths } from '../utils/constants';
import { requestBackend } from './requestBackend';

export async function getSession(sessionId: string) {
  return requestBackend<{ question: IQuestion }>({
    url: `${backendServicesPaths.collaboration.getSession}/${sessionId}`,
    method: HttpRequestMethod.GET,
  });
}

export function getSessionTicket(sessionId: string) {
  return requestBackend<{ ticket: string }>({
    url: backendServicesPaths.collaboration.getSessionTicket(sessionId),
    method: HttpRequestMethod.GET,
  });
}

export async function updateSessionLanguageId(sessionId: string, languageId: number) {
  return requestBackend<void>({
    url: backendServicesPaths.collaboration.sessionLanguage(sessionId),
    method: HttpRequestMethod.PATCH,
    data: {
      languageId,
    },
  });
}
