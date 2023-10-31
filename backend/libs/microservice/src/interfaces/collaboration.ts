/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ID } from './common';
import { Empty } from './google/protobuf/empty';
import { Question } from './question';
import { Language } from './user';

export const COLLABORATION_SERVICE_NAME = 'CollaborationService';

export interface CreateCollabSessionRequest {
  userIds: string[];
  questionId: string;
}

export interface GetQuestionIdFromSessionIdResponse {
  questionId: string;
}

export interface GetSessionOrTicketRequest {
  sessionId: string;
  userId: string;
}

export interface SetSessionLanguageIdRequest {
  sessionId: string;
  userId: string;
  languageId: number;
}

export interface GetSessionResponse {
  question: Question | undefined;
}

export interface GetSessionTicketResponse {
  ticket: string;
}

export interface GetSessionIdFromTicketResponse {
  sessionId: string;
}

export interface Session {
  id: string;
  questionId: string;
  userIds: UserId[];
  sessionTickets: SessionTicket[];
}

export interface UserId {
  userId: string;
}

export interface SessionTicket {
  ticketId: string;
}

export interface CollaborationServiceClient {
  createCollabSession(request: CreateCollabSessionRequest): Observable<Session>;

  getSession(
    request: GetSessionOrTicketRequest,
  ): Observable<GetSessionResponse>;

  getSessionTicket(
    request: GetSessionOrTicketRequest,
  ): Observable<GetSessionTicketResponse>;

  getSessionIdFromTicket(
    request: ID,
  ): Observable<GetSessionIdFromTicketResponse>;

  getQuestionIdFromSessionId(
    request: ID,
  ): Observable<GetQuestionIdFromSessionIdResponse>;

  getLanguageIdFromSessionId(request: ID): Observable<Language>;

  setSessionLanguageId(request: SetSessionLanguageIdRequest): Observable<Empty>;
}

export interface CollaborationServiceController {
  createCollabSession(
    request: CreateCollabSessionRequest,
  ): Promise<Session> | Observable<Session> | Session;

  getSession(
    request: GetSessionOrTicketRequest,
  ):
    | Promise<GetSessionResponse>
    | Observable<GetSessionResponse>
    | GetSessionResponse;

  getSessionTicket(
    request: GetSessionOrTicketRequest,
  ):
    | Promise<GetSessionTicketResponse>
    | Observable<GetSessionTicketResponse>
    | GetSessionTicketResponse;

  getSessionIdFromTicket(
    request: ID,
  ):
    | Promise<GetSessionIdFromTicketResponse>
    | Observable<GetSessionIdFromTicketResponse>
    | GetSessionIdFromTicketResponse;

  getQuestionIdFromSessionId(
    request: ID,
  ):
    | Promise<GetQuestionIdFromSessionIdResponse>
    | Observable<GetQuestionIdFromSessionIdResponse>
    | GetQuestionIdFromSessionIdResponse;

  getLanguageIdFromSessionId(
    request: ID,
  ): Promise<Language> | Observable<Language> | Language;

  setSessionLanguageId(request: SetSessionLanguageIdRequest): void;
}

export function CollaborationServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createCollabSession',
      'getSession',
      'getSessionTicket',
      'getSessionIdFromTicket',
      'getQuestionIdFromSessionId',
      'getLanguageIdFromSessionId',
      'setSessionLanguageId',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod(COLLABORATION_SERVICE_NAME, method)(
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
      GrpcStreamMethod(COLLABORATION_SERVICE_NAME, method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}
