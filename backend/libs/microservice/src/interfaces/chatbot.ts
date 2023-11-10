/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export interface ChatbotRequest {
  query: string;
  sessionId: string;
  userId: string;
  language: string;
  userSolution: string;
}

export interface ChatHistoryRequest {
  userId: string;
  sessionId: string;
}

export interface ChatMessage {
  content: string;
  role: string;
}

export interface ChatMessagesResponse {
  messages: ChatMessage[];
}

export interface ChatbotServiceClient {
  createChatQuery(request: ChatbotRequest): Observable<ChatMessagesResponse>;

  getChatHistory(request: ChatHistoryRequest): Observable<ChatMessagesResponse>;
}

export interface ChatbotServiceController {
  createChatQuery(
    request: ChatbotRequest,
  ):
    | Promise<ChatMessagesResponse>
    | Observable<ChatMessagesResponse>
    | ChatMessagesResponse;

  getChatHistory(
    request: ChatHistoryRequest,
  ):
    | Promise<ChatMessagesResponse>
    | Observable<ChatMessagesResponse>
    | ChatMessagesResponse;
}

export function ChatbotServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['createChatQuery', 'getChatHistory'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('ChatbotService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('ChatbotService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const CHATBOT_SERVICE_NAME = 'ChatbotService';
