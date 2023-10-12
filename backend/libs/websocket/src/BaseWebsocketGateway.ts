import {
  UserServiceApi,
  WebsocketTicket,
} from '@app/microservice/interservice-api/user';
import { ClientProxy } from '@nestjs/microservices';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { catchError, firstValueFrom, of } from 'rxjs';
import { AuthenticatedWebsocket } from './types';

/**
 * BaseWebsocketGateway class which handles authentication via a custom ticketing
 * system on websocket connections.
 */
export class BaseWebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private static TICKET_KEY = 'ticket';
  private static UNAUTHORIZED_MESSAGE = 'unauthorized';

  constructor(private readonly userServiceClient: ClientProxy) {}

  static getTicketIdFromUrl(request: Request) {
    const url = new URL(request.url, 'http://placeholder.com');
    return url.searchParams.get(BaseWebsocketGateway.TICKET_KEY);
  }

  /**
   * Authenticates incoming websocket connection with accompanying connection ticket.
   *
   * `handleConnection` returns true if connection is successful, else closes the connection
   * and returns false.
   */
  async handleConnection(
    connection: AuthenticatedWebsocket,
    request: Request,
  ): Promise<boolean> {
    const ticketId = BaseWebsocketGateway.getTicketIdFromUrl(request);

    if (!ticketId) {
      return BaseWebsocketGateway.closeConnection(connection);
    }

    const ticket = await firstValueFrom(
      this.userServiceClient
        .send<WebsocketTicket, string>(
          UserServiceApi.CONSUME_WEBSOCKET_TICKET,
          ticketId,
        )
        .pipe(catchError(() => of(null))),
    );

    if (!ticket) {
      return BaseWebsocketGateway.closeConnection(connection);
    }

    connection.ticket = ticket;
    return true;
  }

  // Close connection and return `false` for authentication failure.
  private static closeConnection(connection: AuthenticatedWebsocket) {
    connection.send(BaseWebsocketGateway.UNAUTHORIZED_MESSAGE);
    connection.close();
    return false;
  }

  handleDisconnect(): void {
    // No implementation
  }
}
