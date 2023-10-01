// Service to store and retrieve the websocket connections in memory, based on the user id.
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WebsocketMemoryService {
  private connections: Map<string, Socket> = new Map();

  addConnection(userId: string, socket: Socket) {
    if (this.connections.has(userId)) {
      if (this.connections.get(userId) === socket) {
        return;
      } else {
        this.connections.get(userId).disconnect();
      }
    }

    this.connections.set(userId, socket);
  }

  getConnection(userId: string) {
    return this.connections.get(userId);
  }

  isConnected(userId: string) {
    if (!this.connections.has(userId)) {
      return false;
    }

    const socket = this.connections.get(userId);

    return socket.connected;
  }

  removeConnection(userId: string) {
    this.connections.delete(userId);
  }
}
