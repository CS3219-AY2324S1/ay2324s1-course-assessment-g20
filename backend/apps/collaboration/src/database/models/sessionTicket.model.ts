import { BaseModel } from '@app/sql-database';

export class SessionTicketModel extends BaseModel {
  static tableName = 'sessionTickets';

  readonly sessionId: string;
  readonly ticketId: string;
}
