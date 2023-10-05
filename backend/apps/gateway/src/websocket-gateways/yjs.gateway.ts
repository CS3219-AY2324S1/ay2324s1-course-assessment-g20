import { Inject } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { setupWSConnection, setPersistence } from 'y-websocket/bin/utils';
import {
  COLLABORATION_SERVICE,
  CollaborationServiceApi,
} from '@app/interservice-api/collaboration';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MongodbPersistence } from 'y-mongodb-provider';
import * as Y from 'yjs';
import { BaseWebsocketGateway } from '@app/websocket';
import { Service } from '@app/interservice-api/services';

@WebSocketGateway({ path: '/yjs' })
export class YjsGateway extends BaseWebsocketGateway {
  private static SESSION_INITIALIZED = 'session_initialized';

  constructor(
    @Inject(Service.USER_SERVICE)
    userServiceClient: ClientProxy,
    @Inject(COLLABORATION_SERVICE)
    private readonly collaborationServiceClient: ClientProxy,
  ) {
    super(userServiceClient);
  }

  async handleConnection(connection: WebSocket, request: Request) {
    const authenticated = await super.handleConnection(connection, request);

    if (!authenticated) {
      return false;
    }

    const ticketId = YjsGateway.getTicketIdFromUrl(request);
    const { sessionId } = await firstValueFrom(
      this.collaborationServiceClient.send(
        CollaborationServiceApi.GET_SESSION_ID_FROM_TICKET,
        ticketId,
      ),
    );

    YjsGateway.setupYjs(connection, sessionId);
    return YjsGateway.sessionInitialized(connection);
  }

  private static setupYjs(connection, docName) {
    /**
     * Yjs `setupWSConnection` expects a Request object for auto room detection.
     * We are not using this feature, and can just pass in a dummy object.
     */
    const dummyRequest = new Request(new URL('https://placeholder.com'));
    setupWSConnection(connection, dummyRequest, {
      docName,
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
      writeState: async (docName) => {
        // This is called when all connections to the document are closed.

        // flush document on close to have the smallest possible database
        await mdb.flushDocument(docName);
      },
    });
  }

  private static sessionInitialized(connection: WebSocket) {
    connection.send(YjsGateway.SESSION_INITIALIZED);
    return true;
  }
}
