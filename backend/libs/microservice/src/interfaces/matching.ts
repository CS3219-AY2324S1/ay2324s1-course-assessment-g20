/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ID } from './common';
import { Empty } from './google/protobuf/empty';

export interface MatchingEntry {
  userId: string;
  questionDifficulty: string;
}

export interface MatchingServiceClient {
  requestMatch(request: MatchingEntry): Observable<Empty>;

  deleteMatchEntryByUserId(request: ID): Observable<Empty>;
}

export interface MatchingServiceController {
  requestMatch(request: MatchingEntry): void;

  deleteMatchEntryByUserId(request: ID): void;
}

export function MatchingServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['requestMatch', 'deleteMatchEntryByUserId'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('MatchingService', method)(
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
      GrpcStreamMethod('MatchingService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const MATCHING_SERVICE_NAME = 'MatchingService';
