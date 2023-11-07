/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const HISTORY_SERVICE_NAME = 'HistoryService';

export interface CreateHistoryAttemptRequest {
  sessionId: string;
  questionAttempt: string;
}

export interface CreateHistoryAttemptResponse {
  histories: History[];
}

export interface GetAttemptsByUsernameRequest {
  username: string;
}

export interface GetAttemptsByUsernameResponse {
  attempts: Attempt[];
}

export interface History {
  id: string;
  username: string;
  attempts: Attempt[];
}

export interface Attempt {
  languageId: number;
  questionId: string;
  questionAttempt: string;
  dateTimeAttempted: Date;
}

export interface HistoryServiceClient {
  createHistoryAttempt(
    request: CreateHistoryAttemptRequest,
  ): Observable<CreateHistoryAttemptResponse>;

  getAttemptsByUsername(
    request: GetAttemptsByUsernameRequest,
  ): Observable<GetAttemptsByUsernameResponse>;
}

export interface HistoryServiceController {
  createHistoryAttempt(
    request: CreateHistoryAttemptRequest,
  ):
    | Promise<CreateHistoryAttemptResponse>
    | Observable<CreateHistoryAttemptResponse>
    | CreateHistoryAttemptResponse;

  getAttemptsByUsername(
    request: GetAttemptsByUsernameRequest,
  ):
    | Promise<GetAttemptsByUsernameResponse>
    | Observable<GetAttemptsByUsernameResponse>
    | GetAttemptsByUsernameResponse;
}

export function HistoryServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createHistoryAttempt',
      'getAttemptsByUsername',
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
