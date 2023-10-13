import { OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { AuthController as UserAuthService } from 'apps/user/src/auth/auth.controller';
import { promisify } from '@app/microservice/utils';

/**
 * BaseWebsocketGateway class which handles authentication via a custom ticketing
 * system on websocket connections.
 */
export class BaseWebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  private static TICKET_KEY = 'ticket';
  private static UNAUTHORIZED_MESSAGE = 'unauthorized';

  private userAuthService: UserAuthService;

  constructor(private readonly client: ClientGrpc) {}

  static getTicketIdFromUrl(request: Request) {
    const url = new URL(request.url, 'http://placeholder.com');
    return url.searchParams.get(BaseWebsocketGateway.TICKET_KEY);
  }

  onModuleInit() {
    this.userAuthService = promisify(
      this.client.getService<UserAuthService>('UserAuthService'),
    );
  }

  /**
   * Authenticates incoming websocket connection with accompanying connection ticket.
   *
   * `handleConnection` returns true if connection is successful, else closes the connection
   * and returns false.
   */
  async handleConnection(
    connection: WebSocket,
    request: Request,
  ): Promise<boolean> {
    const ticketId = BaseWebsocketGateway.getTicketIdFromUrl(request);

    if (!ticketId) {
      return BaseWebsocketGateway.closeConnection(connection);
    }

    const ticket = await this.userAuthService.consumeWebsocketTicket({
      id: ticketId,
    });

    if (!ticket) {
      return BaseWebsocketGateway.closeConnection(connection);
    }

    return true;
  }

  // Close connection and return `false` for authentication failure.
  private static closeConnection(connection: WebSocket) {
    connection.send(BaseWebsocketGateway.UNAUTHORIZED_MESSAGE);
    connection.close();
    return false;
  }

  handleDisconnect(): void {
    // No implementation
  }
}
