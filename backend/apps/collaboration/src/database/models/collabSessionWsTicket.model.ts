import { BaseModel } from '@app/sql-database';

export class CollabSessionWsTicketModel extends BaseModel {
  static tableName = 'collabSessionWsTickets';

  readonly userId: string;
  readonly expiry: Date;
  readonly sessionId: string;
}
