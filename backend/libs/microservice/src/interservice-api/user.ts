import { BaseModel } from '@app/sql-database';
import { Model } from 'objection';

export type CreateWebsocketTicketInfo = {
  userId: string;
};

export type WebsocketTicket = Omit<BaseModel, keyof Model> & {
  userId: string;
  expiry: Date;
  isUsed: boolean;
};
