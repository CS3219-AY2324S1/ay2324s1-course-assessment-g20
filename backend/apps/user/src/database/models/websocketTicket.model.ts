import { BaseModel } from '@app/sql-database';

export class WebsocketTicketModel extends BaseModel {
  static tableName = 'websocketTickets';

  readonly userId: string;
  readonly expiry: Date;
  readonly isUsed: boolean;
}
