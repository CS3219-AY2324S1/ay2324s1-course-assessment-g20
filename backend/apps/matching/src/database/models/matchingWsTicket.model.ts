import { BaseModel } from '@app/sql-database';

export class MatchingWsTicketModel extends BaseModel {
  static tableName = 'MatchingWsTickets';

  readonly userId: string;
  readonly expiry: Date;
}
