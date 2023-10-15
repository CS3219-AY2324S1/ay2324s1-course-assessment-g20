/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Empty } from './google/protobuf/empty';

export interface MatchingEntry {
  userId: string;
  questionDifficulty: string;
}

export interface MatchingServiceClient {
  requestMatch(request: MatchingEntry): Observable<Empty>;
}

export interface MatchingServiceController {
  requestMatch(request: MatchingEntry): void;
}

export function MatchingServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['requestMatch'];
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
