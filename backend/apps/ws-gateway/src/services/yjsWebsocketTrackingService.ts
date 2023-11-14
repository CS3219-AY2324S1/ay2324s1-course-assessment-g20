import { Inject, Injectable } from '@nestjs/common';
import { YjsWebsocket } from '../websocket-gateways/yjs.gateway';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  CollaborationServiceClient,
  COLLABORATION_SERVICE_NAME,
} from '@app/microservice/interfaces/collaboration';
import { ClientGrpc } from '@nestjs/microservices';
import { Service } from '@app/microservice/services';
import { firstValueFrom } from 'rxjs';

import { Mutex } from 'async-mutex';

const mutex = new Mutex();

@Injectable()
export class YjsWebsocketTrackingService {
  private connectionMaps: Map<string, Map<string, YjsWebsocket>> = new Map();
  private collaborationService: CollaborationServiceClient;

  constructor(
    @Inject(Service.COLLABORATION_SERVICE)
    private readonly collaborationServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.collaborationService =
      this.collaborationServiceClient.getService<CollaborationServiceClient>(
        COLLABORATION_SERVICE_NAME,
      );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const sessionIds = Array.from(this.connectionMaps.keys());
    for (const sessionId of sessionIds) {
      const sockets = this.connectionMaps.get(sessionId).values();
      for (const socket of sockets) {
        if (socket.readyState === socket.CLOSED) {
          await this.removeConnection(socket);
        }
      }
      const count = this.getCount(sessionId);
      if (count === 0) {
        await firstValueFrom(
          this.collaborationService.closeSession({ id: sessionId }),
        );
        this.connectionMaps.delete(sessionId);
      }
    }
  }

  async addConnection(socket: YjsWebsocket) {
    const release = await mutex.acquire();
    const { sessionId } = socket;
    if (this.connectionMaps.has(sessionId)) {
      this.connectionMaps.get(sessionId).set(socket.ticket.id, socket);
    } else {
      this.connectionMaps.set(sessionId, new Map([[socket.ticket.id, socket]]));
    }
    release();
  }

  async removeConnection(socket: YjsWebsocket) {
    const release = await mutex.acquire();
    if (this.connectionMaps.has(socket.sessionId)) {
      if (socket.ticket?.id) {
        this.connectionMaps.get(socket.sessionId).delete(socket.ticket.id);
      }
    }

    release();
  }

  getCount(sessionId: string) {
    if (this.connectionMaps.has(sessionId)) {
      return this.connectionMaps.get(sessionId).size;
    }

    return 0;
  }
}
