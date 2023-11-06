/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { wrappers } from 'protobufjs';
import { Observable } from 'rxjs';
import { Deleted, ID, IDs, NumericID } from './common';
import { Empty } from './google/protobuf/empty';
import { BoolValue } from './google/protobuf/wrappers';

export interface User {
  id?: string | undefined;
  authProvider: string;
  authProviderId: string;
  email: string;
  oauthName: string;
  userProfile: UserProfile | undefined;
}

export interface UserProfile {
  userId?: string | undefined;
  name: string;
  preferredLanguageId: number;
  roleId: number;
  preferredLanguage?: Language | undefined;
  role?: Role | undefined;
  username?: string | undefined;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface CreateWebsocketTicketInfoRequest {
  userId: string;
}

export interface WebsocketTicket {
  id: string;
  expiry: Date | undefined;
  isUsed: boolean;
  userId: string;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Username {
  username: string;
}

export interface Language {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface GetAllLanguagesResponse {
  languages: Language[];
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

export interface UserAuthServiceClient {
  generateJwts(request: User): Observable<JwtTokens>;

  generateJwtsFromRefreshToken(
    request: RefreshTokenRequest,
  ): Observable<JwtTokens>;

  findOrCreateOauthUser(request: User): Observable<User>;

  deleteOAuthUser(request: ID): Observable<Deleted>;

  generateWebsocketTicket(
    request: CreateWebsocketTicketInfoRequest,
  ): Observable<WebsocketTicket>;

  consumeWebsocketTicket(request: ID): Observable<WebsocketTicket>;

  validateUsersExists(request: IDs): Observable<BoolValue>;
}

export interface UserAuthServiceController {
  generateJwts(
    request: User,
  ): Promise<JwtTokens> | Observable<JwtTokens> | JwtTokens;

  generateJwtsFromRefreshToken(
    request: RefreshTokenRequest,
  ): Promise<JwtTokens> | Observable<JwtTokens> | JwtTokens;

  findOrCreateOauthUser(request: User): Promise<User> | Observable<User> | User;

  deleteOAuthUser(
    request: ID,
  ): Promise<Deleted> | Observable<Deleted> | Deleted;

  generateWebsocketTicket(
    request: CreateWebsocketTicketInfoRequest,
  ): Promise<WebsocketTicket> | Observable<WebsocketTicket> | WebsocketTicket;

  consumeWebsocketTicket(
    request: ID,
  ): Promise<WebsocketTicket> | Observable<WebsocketTicket> | WebsocketTicket;

  validateUsersExists(
    request: IDs,
  ): Promise<BoolValue> | Observable<BoolValue> | BoolValue;
}

export function UserAuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'generateJwts',
      'generateJwtsFromRefreshToken',
      'findOrCreateOauthUser',
      'deleteOAuthUser',
      'generateWebsocketTicket',
      'consumeWebsocketTicket',
      'validateUsersExists',
    ];
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
