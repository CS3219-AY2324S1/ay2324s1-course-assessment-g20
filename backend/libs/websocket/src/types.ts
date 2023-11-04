import { WebsocketTicket } from '@app/microservice/interfaces/user';
import Redis from 'ioredis';

export type AuthenticatedWebsocket = WebSocket & {
  ticket: WebsocketTicket;
  redisClient?: Redis;
};
