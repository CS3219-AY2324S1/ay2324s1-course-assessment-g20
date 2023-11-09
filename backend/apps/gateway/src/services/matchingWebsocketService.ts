import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchingWebsocketService {
  private connections: Map<string, WebSocket> = new Map();

  addConnection(userId: string, socket: WebSocket) {
    if (this.connections.has(userId)) {
      if (this.connections.get(userId) === socket) {
        return;
      } else {
        this.connections.get(userId).close();
      }
    }

    this.connections.set(userId, socket);
  }

  getConnection(userId: string) {
    return this.connections.get(userId);
  }

  removeConnection(userId: string) {
    this.connections.delete(userId);
  }
}
