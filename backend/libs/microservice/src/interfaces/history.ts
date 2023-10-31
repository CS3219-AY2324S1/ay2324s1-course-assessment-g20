/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
// import { Observable } from 'rxjs';
// import { ID } from './common';
// import { Question } from './question';

export const HISTORY_SERVICE_NAME = 'HistoryService';

// export interface CreateCollabSessionRequest {
//   userIds: string[];
//   questionId: string;
// }

// export interface GetQuestionIdFromSessionIdResponse {
//   questionId: string;
// }

// export interface GetSessionAndWsTicketRequest {
//   sessionId: string;
//   userId: string;
// }

// export interface GetSessionAndWsTicketResponse {
//   question: Question | undefined;
//   ticket: string;
// }

// export interface GetSessionIdFromTicketResponse {
//   sessionId: string;
// }

// export interface Session {
//   id: string;
//   questionId: string;
//   userIds: UserId[];
//   sessionTickets: SessionTicket[];
// }

export interface UserId {
  userId: string;
}

export interface SessionTicket {
  ticketId: string;
}

export interface HistoryServiceClient {
  createHistoryAttempt(): void;
}

export interface HistoryServiceController {
  createHistoryAttempt(): void;
}

export function HistoryServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['createHistoryAttempt'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod(HISTORY_SERVICE_NAME, method)(
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
      GrpcStreamMethod(HISTORY_SERVICE_NAME, method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}
