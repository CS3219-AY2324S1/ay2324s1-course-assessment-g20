import {
  USER_AUTH_SERVICE_NAME,
  UserAuthServiceClient,
} from '@app/microservice/interfaces/user';
import { OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { AuthenticatedWebsocket } from './types';

/**
 * BaseWebsocketGateway class which handles authentication via a custom ticketing
 * system on websocket connections.
 */
export class BaseWebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  private static TICKET_KEY = 'ticket';
  private static UNAUTHORIZED_MESSAGE = 'unauthorized';

  private userAuthService: UserAuthServiceClient;

  constructor(private readonly userServiceClient: ClientGrpc) {}

  static getTicketIdFromUrl(request: Request) {
    const url = new URL(request.url, 'http://placeholder.com');
    return url.searchParams.get(BaseWebsocketGateway.TICKET_KEY);
  }

  onModuleInit() {
    this.userAuthService =
      this.userServiceClient.getService<UserAuthServiceClient>(
        USER_AUTH_SERVICE_NAME,
      );
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
      this.userAuthService.consumeWebsocketTicket({
        id: ticketId,
      }),
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