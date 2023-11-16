/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Deleted, ID, NumericID } from './common';
import { Empty } from './google/protobuf/empty';

export interface CreateUserRequest {
  name: string;
}

export interface User {
  id?: string | undefined;
  name: string;
  userProfile: UserProfile | undefined;
}

export interface UserProfile {
  userId?: string | undefined;
  name: string;
  preferredLanguageId: number;
  preferredLanguage?: Language | undefined;
  username?: string | undefined;
}

export interface Username {
  username: string;
}

export interface Language {
  id: number;
  name: string;
}

export interface GetAllLanguagesResponse {
  languages: Language[];
}

export interface UserAuthServiceClient {
  createUser(request: CreateUserRequest): Observable<User>;

  deleteUser(request: ID): Observable<Deleted>;
}

export interface UserAuthServiceController {
  createUser(
    request: CreateUserRequest,
  ): Promise<User> | Observable<User> | User;

  deleteUser(request: ID): Promise<Deleted> | Observable<Deleted> | Deleted;
}

export function UserAuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['createUser', 'deleteUser'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('UserAuthService', method)(
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
      GrpcStreamMethod('UserAuthService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const USER_AUTH_SERVICE_NAME = 'UserAuthService';

export interface UserLanguageServiceClient {
  getAllLanguages(request: Empty): Observable<GetAllLanguagesResponse>;

  getLanguageById(request: NumericID): Observable<Language>;
}

export interface UserLanguageServiceController {
  getAllLanguages(
    request: Empty,
  ):
    | Promise<GetAllLanguagesResponse>
    | Observable<GetAllLanguagesResponse>
    | GetAllLanguagesResponse;

  getLanguageById(
    request: NumericID,
  ): Promise<Language> | Observable<Language> | Language;
}

export function UserLanguageServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['getAllLanguages', 'getLanguageById'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('UserLanguageService', method)(
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
      GrpcStreamMethod('UserLanguageService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const USER_LANGUAGE_SERVICE_NAME = 'UserLanguageService';

export interface UserProfileServiceClient {
  getUserProfileById(request: ID): Observable<UserProfile>;

  getUserProfileByUsername(request: Username): Observable<UserProfile>;

  updateUserProfile(request: UserProfile): Observable<UserProfile>;
}

export interface UserProfileServiceController {
  getUserProfileById(
    request: ID,
  ): Promise<UserProfile> | Observable<UserProfile> | UserProfile;

  getUserProfileByUsername(
    request: Username,
  ): Promise<UserProfile> | Observable<UserProfile> | UserProfile;

  updateUserProfile(
    request: UserProfile,
  ): Promise<UserProfile> | Observable<UserProfile> | UserProfile;
}

export function UserProfileServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getUserProfileById',
      'getUserProfileByUsername',
      'updateUserProfile',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('UserProfileService', method)(
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
      GrpcStreamMethod('UserProfileService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const USER_PROFILE_SERVICE_NAME = 'UserProfileService';
