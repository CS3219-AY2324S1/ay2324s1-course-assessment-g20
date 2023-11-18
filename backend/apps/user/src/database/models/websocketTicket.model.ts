import { BaseModelUUID } from '@app/sql-database';

export class WebsocketTicketModel extends BaseModelUUID {
  static tableName = 'websocketTickets';

  readonly userId: string;
  readonly expiry: Date;
  readonly isUsed: boolean;
}
