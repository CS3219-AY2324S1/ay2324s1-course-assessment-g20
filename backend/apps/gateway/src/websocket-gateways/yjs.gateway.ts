import { Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Request } from 'express';
import { Server } from 'ws';
import { setupWSConnection, setPersistence } from 'y-websocket/bin/utils';
import {
  COLLABORATION_SERVICE,
  CollaborationServiceApi,
} from '@app/interservice-api/collaboration';
import { ClientProxy } from '@nestjs/microservices';
import { CollabSessionWsTicketModel } from 'apps/collaboration/src/database/models/collabSessionWsTicket.model';
import { catchError, firstValueFrom, of } from 'rxjs';
import { MongodbPersistence } from 'y-mongodb-provider';
import * as Y from 'yjs';

const TICKET_KEY = 'ticket';

@WebSocketGateway({ path: '/yjs' })
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(COLLABORATION_SERVICE)
    private readonly collaborationServiceClient: ClientProxy,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(connection: WebSocket, request: Request) {
    const url = new URL(request.url, 'http://placeholder.com');
    const ticketId = url.searchParams.get(TICKET_KEY);
    const ticket = await firstValueFrom(
      this.collaborationServiceClient
        .send<CollabSessionWsTicketModel>(
          CollaborationServiceApi.CONSUME_WS_TICKET,
          ticketId,
        )
        .pipe(catchError((e) => of(null))),
    );

    if (!ticket) {
      return connection.close();
    }

    setupWSConnection(connection, request, {
      docName: ticket.sessionId,
    });

    const mdb = new MongodbPersistence(
      'mongodb://localhost:27017/peer-prep-collaboration',
      {
        flushSize: 100,
        multipleCollections: true,
      },
    );

    setPersistence({
      bindState: async (docName, ydoc) => {
        const persistedYdoc = await mdb.getYDoc(docName);
        const persistedStateVector = Y.encodeStateVector(persistedYdoc);
        const diff = Y.encodeStateAsUpdate(ydoc, persistedStateVector);

        // store the new data in db (if there is any: empty update is an array of 0s)
        if (
          diff.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          ) > 0
        )
          mdb.storeUpdate(docName, diff);

        // send the persisted data to clients
        Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));

        // store updates of the document in db
        ydoc.on('update', async (update) => {
          mdb.storeUpdate(docName, update);
        });

        persistedYdoc.destroy();
      },
      writeState: async (docName, ydoc) => {
        // This is called when all connections to the document are closed.

        // flush document on close to have the smallest possible database
        await mdb.flushDocument(docName);
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleDisconnect(): void {}
}
