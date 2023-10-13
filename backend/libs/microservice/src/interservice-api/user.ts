import { BaseModel } from '@app/sql-database';
import { Model } from 'objection';

export enum UserServiceApi {
  // User profile related
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
