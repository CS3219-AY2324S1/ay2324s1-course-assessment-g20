import { WebSocketGateway } from '@nestjs/websockets';

export const PrefixedWebsocketGateway = (path: string) =>
  WebSocketGateway({ path: `/ws${path}` });
