/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ID } from './common';

export const HISTORY_SERVICE_NAME = 'HistoryService';

export interface CreateHistoryAttemptRequest {
  sessionId: string;
  questionAttempt: string;
}

export interface CreateHistoryAttemptResponse {
  histories: History[];
}

export interface GetAttemptsByUserIdResponse {
  attempts: Attempt[];
}

export interface History {
  id: string;
  userId: string;
  attempts: Attempt[];
}

export interface Attempt {
  questionId: string;
  questionAttempt: string;
  dateTimeAttempted: Date;
}

export interface HistoryServiceClient {
  createHistoryAttempt(
    request: CreateHistoryAttemptRequest,
  ): Observable<CreateHistoryAttemptResponse>;

  getAttemptsByUserId(request: ID): Observable<GetAttemptsByUserIdResponse>;
}

export interface HistoryServiceController {
  createHistoryAttempt(
    request: CreateHistoryAttemptRequest,
  ):
    | Promise<CreateHistoryAttemptResponse>
    | Observable<CreateHistoryAttemptResponse>
    | CreateHistoryAttemptResponse;

  getAttemptsByUserId(
    request: ID,
  ):
    | Promise<GetAttemptsByUserIdResponse>
    | Observable<GetAttemptsByUserIdResponse>
    | GetAttemptsByUserIdResponse;
}

export function HistoryServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createHistoryAttempt',
      'getAttemptsByUserId',
    ];
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
