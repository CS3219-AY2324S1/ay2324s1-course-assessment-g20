import { BaseModel } from '@app/sql-database';
import { MatchingWsTicketModel } from './src/database/models/matchingWsTicket.model';

// export type CreateSessionInfo = {
//   userIds: string[];
//   questionId: string;
// };

export type CreateTicketInfo = Omit<
  MatchingWsTicketModel,
  'expiry' | keyof BaseModel
>;
