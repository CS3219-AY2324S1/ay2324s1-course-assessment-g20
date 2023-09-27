import { BaseModel } from '@app/sql-database';
import { CollabSessionWsTicketModel } from './database/models/collabSessionWsTicket.model';

export type CreateSessionInfo = {
  userIds: string[];
};

export type CreateSessionTicketInfo = Omit<
  CollabSessionWsTicketModel,
  'expiry' & keyof BaseModel
>;
