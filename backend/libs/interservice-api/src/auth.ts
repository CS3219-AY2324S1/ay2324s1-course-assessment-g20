import { BaseModel } from '@app/sql-database';
import { Model } from 'objection';

export enum AuthServiceApi {
  GENERATE_JWTS = 'generate_jwts',
  GENERATE_JWTS_FROM_REFRESH_TOKEN = 'generate_jwts_from_refresh_token',
  FIND_OR_CREATE_OAUTH_USER = 'find_or_create_oauth_user',
  GENERATE_WEBSOCKET_TICKET = 'generate_websocket_ticket',
  CONSUME_WEBSOCKET_TICKET = 'consume_websocket_ticket',
}

export type CreateWebsocketTicketInfo = {
  userId: string;
};

export type WebsocketTicket = Omit<BaseModel, keyof Model> & {
  userId: string;
  expiry: Date;
  isUsed: boolean;
};

export const AUTH_SERVICE = 'AUTH_SERVICE';
