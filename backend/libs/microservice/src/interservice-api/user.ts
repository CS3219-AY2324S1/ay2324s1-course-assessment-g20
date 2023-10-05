import { BaseModel } from '@app/sql-database';
import { Model } from 'objection';

export enum UserServiceApi {
  // JWT authentication
  GENERATE_JWTS = 'generate_jwts',
  GENERATE_JWTS_FROM_REFRESH_TOKEN = 'generate_jwts_from_refresh_token',
  FIND_OR_CREATE_OAUTH_USER = 'find_or_create_oauth_user',

  // Websocket related authentication
  GENERATE_WEBSOCKET_TICKET = 'generate_websocket_ticket',
  CONSUME_WEBSOCKET_TICKET = 'consume_websocket_ticket',

  // User profile related
  DELETE_OAUTH_USER = 'delete_oauth_user',
  GET_USER_PROFILE = 'get_user_profile',
  UPDATE_USER_PROFILE = 'update_user_profile',
  GET_ALL_LANGUAGES = 'get_all_languages',
}

export type CreateWebsocketTicketInfo = {
  userId: string;
};

export type WebsocketTicket = Omit<BaseModel, keyof Model> & {
  userId: string;
  expiry: Date;
  isUsed: boolean;
};
