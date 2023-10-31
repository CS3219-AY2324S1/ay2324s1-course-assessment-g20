/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Empty } from './google/protobuf/empty';
// import { Observable } from 'rxjs';
// import { ID } from './common';
// import { Question } from './question';

export const HISTORY_SERVICE_NAME = 'HistoryService';

export interface CreateHistoryAttemptRequest {
  sessionId: string;
  questionAttempt: string;
}

export interface CreateHistoryAttemptResponse {
  histories: History[];
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
}

export interface HistoryServiceController {
  createHistoryAttempt(
    request: CreateHistoryAttemptRequest,
  ):
    | Promise<CreateHistoryAttemptResponse>
    | Observable<CreateHistoryAttemptResponse>
    | CreateHistoryAttemptResponse;
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
