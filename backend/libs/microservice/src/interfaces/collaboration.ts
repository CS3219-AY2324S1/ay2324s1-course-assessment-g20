/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { wrappers } from 'protobufjs';
import { Observable } from 'rxjs';
import { ID } from './common';
import { Empty } from './google/protobuf/empty';
import { Question } from './question';
import { Language } from './user';

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
  languageId: number;
}

export interface GetSessionResponse {
  question: Question | undefined;
  otherUserUsername: string;
}

export interface GetSessionTicketResponse {
  ticket: string;
}

export interface GetSessionFromTicketResponse {
  id: string;
  questionId: string;
  languageId: number;
  isClosed: boolean;
}

export interface GetAttemptsFromUserIdResponse {
  attempts: Attempt[];
}

export interface Attempt {
  attemptTextByLanguageId: { [key: number]: string };
  dateTimeAttempted: Date | undefined;
  question: Question | undefined;
  languageId: number;
  sessionId: string;
  isClosed: boolean;
}

export interface Attempt_AttemptTextByLanguageIdEntry {
  key: number;
  value: string;
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

wrappers['.google.protobuf.Timestamp'] = {
  fromObject(value: Date) {
    return {
      seconds: value.getTime() / 1000,
      nanos: (value.getTime() % 1000) * 1e6,
    };
  },
  toObject(message: { seconds: number; nanos: number }) {
    return new Date(message.seconds * 1000 + message.nanos / 1e6);
  },
} as any;

export interface CollaborationServiceClient {
  createCollabSession(request: CreateCollabSessionRequest): Observable<Session>;

  getSession(
    request: GetSessionOrTicketRequest,
  ): Observable<GetSessionResponse>;

  getSessionTicket(
    request: GetSessionOrTicketRequest,
  ): Observable<GetSessionTicketResponse>;

  getSessionFromTicket(request: ID): Observable<GetSessionFromTicketResponse>;

  getQuestionIdFromSessionId(
    request: ID,
  ): Observable<GetQuestionIdFromSessionIdResponse>;

  getLanguageIdFromSessionId(request: ID): Observable<Language>;

  setSessionLanguageId(request: SetSessionLanguageIdRequest): Observable<Empty>;

  getAttemptsFromUserId(request: ID): Observable<GetAttemptsFromUserIdResponse>;

  getSessionAttempt(request: GetSessionOrTicketRequest): Observable<Attempt>;

  closeSession(request: ID): Observable<Empty>;
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

  getSessionFromTicket(
    request: ID,
  ):
    | Promise<GetSessionFromTicketResponse>
    | Observable<GetSessionFromTicketResponse>
    | GetSessionFromTicketResponse;

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

  getAttemptsFromUserId(
    request: ID,
  ):
    | Promise<GetAttemptsFromUserIdResponse>
    | Observable<GetAttemptsFromUserIdResponse>
    | GetAttemptsFromUserIdResponse;

  getSessionAttempt(
    request: GetSessionOrTicketRequest,
  ): Promise<Attempt> | Observable<Attempt> | Attempt;

  closeSession(request: ID): void;
}

export function CollaborationServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createCollabSession',
      'getSession',
      'getSessionTicket',
      'getSessionFromTicket',
      'getQuestionIdFromSessionId',
      'getLanguageIdFromSessionId',
      'setSessionLanguageId',
      'getAttemptsFromUserId',
      'getSessionAttempt',
      'closeSession',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('CollaborationService', method)(
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
      GrpcStreamMethod('CollaborationService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const COLLABORATION_SERVICE_NAME = 'CollaborationService';
