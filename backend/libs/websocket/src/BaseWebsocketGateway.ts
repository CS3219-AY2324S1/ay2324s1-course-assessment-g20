import { AuthServiceApi, WebsocketTicket } from '@app/interservice-api/auth';
import { ClientProxy } from '@nestjs/microservices';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { catchError, firstValueFrom, of } from 'rxjs';

/**
 * BaseWebsocketGateway class which handles authentication via a custom ticketing
 * system on websocket connections.
 */
export class BaseWebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private static TICKET_KEY = 'ticket';

  constructor(private readonly authServiceClient: ClientProxy) {}

  static getTicketIdFromUrl(request: Request) {
    const url = new URL(request.url, 'http://placeholder.com');
    return url.searchParams.get(BaseWebsocketGateway.TICKET_KEY);
  }

  /**
   * Authenticates incoming websocket connection with accompanying connection ticket.
   *
   * `handleConnection` returns true if connection is successful.
   */
  async handleConnection(
    connection: WebSocket,
    request: Request,
  ): Promise<boolean> {
    const ticketId = BaseWebsocketGateway.getTicketIdFromUrl(request);

    if (!ticketId) {
      connection.close();
      return false;
    }

    const ticket = this.getTicketFromTicketId(ticketId);

    return !!ticket;
  }

  async getTicketFromTicketId(ticketId: string) {
    const ticket = await firstValueFrom(
      this.authServiceClient
        .send<WebsocketTicket, string>(
          AuthServiceApi.CONSUME_WEBSOCKET_TICKET,
          ticketId,
        )
        .pipe(catchError((e) => of(null))),
    );

    return ticket;
  }

  /* eslint-disable @typescript-eslint/no-empty-function */
  handleDisconnect(): void {}
}
