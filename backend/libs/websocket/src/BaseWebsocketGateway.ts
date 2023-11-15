import {
  USER_AUTH_SERVICE_NAME,
  UserAuthServiceClient,
} from '@app/microservice/interfaces/user';
import { OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
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
      return BaseWebsocketGateway.closeConnection(
        connection,
        BaseWebsocketGateway.UNAUTHORIZED_MESSAGE,
      );
    }

    const ticket = await firstValueFrom(
      this.userAuthService.consumeWebsocketTicket({
        id: ticketId,
      }),
    ).catch(() => null);

    if (!ticket) {
      return BaseWebsocketGateway.closeConnection(
        connection,
        BaseWebsocketGateway.UNAUTHORIZED_MESSAGE,
      );
    }

    connection.ticket = ticket;
    connection.onerror = (event) => {
      console.error(event);
      throw new WsException(event);
    };
    return true;
  }

  // Close connection and return `false` for authentication failure.
  static closeConnection(connection: AuthenticatedWebsocket, message: string) {
    connection.send(message);
    connection.close();
    return false;
  }

  handleDisconnect(_connection: AuthenticatedWebsocket): void {
    // No implementation
  }
}
