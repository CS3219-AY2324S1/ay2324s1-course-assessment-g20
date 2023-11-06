import { WebsocketTicket } from '@app/microservice/interfaces/user';
import Redis from 'ioredis';

export type AuthenticatedWebsocket = WebSocket & {
  ticket: WebsocketTicket;
};

export type RedisAwareWebsocket = WebSocket & {
  redisClient?: Redis;
};
