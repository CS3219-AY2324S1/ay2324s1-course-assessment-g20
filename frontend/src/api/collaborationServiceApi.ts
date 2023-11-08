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

export async function getSessionAttemptText(sessionId: string) {
  return requestBackend<{ attemptText: string }>({
    url: backendServicesPaths.collaboration.getSessionAttemptText(sessionId),
    method: HttpRequestMethod.GET,
  });
}

export async function getSessionLanguageId(sessionId: string) {
  return requestBackend<{ id: number }>({
    url: backendServicesPaths.collaboration.getSessionLanguageId(sessionId),
    method: HttpRequestMethod.GET,
  });
}
