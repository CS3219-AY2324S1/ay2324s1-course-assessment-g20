/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ID } from './common';
import { Question } from './question';

export interface CreateCollabSessionRequest {
  userIds: string[];
  questionId: string;
}

export interface GetQuestionIdFromSessionIdResponse {
  questionId: string;
}

export interface GetSessionAndWsTicketRequest {
  sessionId: string;
  userId: string;
}

export interface GetSessionAndWsTicketResponse {
  question: Question | undefined;
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

  getSessionAndWsTicket(
    request: GetSessionAndWsTicketRequest,
  ): Observable<GetSessionAndWsTicketResponse>;

  getSessionIdFromTicket(
    request: ID,
  ): Observable<GetSessionIdFromTicketResponse>;

  getQuestionIdFromSessionId(
    request: ID,
  ): Observable<GetQuestionIdFromSessionIdResponse>;
}

export interface CollaborationServiceController {
  createCollabSession(
    request: CreateCollabSessionRequest,
  ): Promise<Session> | Observable<Session> | Session;

  getSessionAndWsTicket(
    request: GetSessionAndWsTicketRequest,
  ):
    | Promise<GetSessionAndWsTicketResponse>
    | Observable<GetSessionAndWsTicketResponse>
    | GetSessionAndWsTicketResponse;

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
}

export function CollaborationServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createCollabSession',
      'getSessionAndWsTicket',
      'getSessionIdFromTicket',
      'getQuestionIdFromSessionId',
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
