import { IChatbotMessageHistory } from '../@types/chatbot';
import { HttpRequestMethod, backendServicesPaths } from '../utils/constants';
import { requestBackend } from './requestBackend';

export async function queryChatbot(
  sessionId: string,
  language: string,
  query: string,
  userSolution: string,
) {
  return requestBackend<IChatbotMessageHistory>({
    url: `${backendServicesPaths.chatbot.query}/${sessionId}`,
    data: {
      language: language,
      query: query,
      userSolution: userSolution,
    },
    method: HttpRequestMethod.POST,
  });
}

export async function getChatbotMessageHistory(sessionId: string) {
  return requestBackend<IChatbotMessageHistory>({
    url: `${backendServicesPaths.chatbot.history}/${sessionId}`,
    method: HttpRequestMethod.GET,
  });
}
