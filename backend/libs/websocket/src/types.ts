import { WebsocketTicket } from '@app/microservice/interfaces/user';

export type AuthenticatedWebsocket = WebSocket & {
  ticket: WebsocketTicket;
};
