import { WebsocketTicket } from '@app/microservice/interservice-api/user';

export type AuthenticatedWebsocket = WebSocket & {
  ticket: WebsocketTicket;
};
