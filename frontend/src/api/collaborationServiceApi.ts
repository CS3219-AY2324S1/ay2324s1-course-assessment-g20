import { Language } from '../@types/language';
import { IQuestion } from '../@types/question';
import { HttpRequestMethod, backendServicesPaths } from '../utils/constants';
import { requestBackend } from './requestBackend';

export async function getSessionAndWsTicket(sessionId: string) {
  return requestBackend<{ question: IQuestion; ticket: string }>({
    url: `${backendServicesPaths.collaboration.getSessionAndWsTicket}/${sessionId}`,
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

export async function getSessionLanguage(sessionId: string) {
  return requestBackend<Language>({
    url: backendServicesPaths.collaboration.sessionLanguage(sessionId),
    method: HttpRequestMethod.GET,
  });
}
