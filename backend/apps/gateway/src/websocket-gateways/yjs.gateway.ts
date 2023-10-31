import { Inject } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { setupWSConnection, setPersistence } from 'y-websocket/bin/utils';
import { ClientGrpc } from '@nestjs/microservices';
import { MongodbPersistence } from 'y-mongodb-provider';
import * as Y from 'yjs';
import { AuthenticatedWebsocket, BaseWebsocketGateway } from '@app/websocket';
import { Service } from '@app/microservice/services';
import {
  COLLABORATION_SERVICE_NAME,
  CollaborationServiceClient,
} from '@app/microservice/interfaces/collaboration';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ path: '/yjs' })
export class YjsGateway extends BaseWebsocketGateway {
  private static SESSION_INITIALIZED = 'session_initialized';
  private mongoUri;
  private collaborationService: CollaborationServiceClient;

  constructor(
    @Inject(Service.USER_SERVICE) userServiceClient: ClientGrpc,
    @Inject(Service.COLLABORATION_SERVICE)
    private readonly collaborationServiceClient: ClientGrpc,
    private readonly configService: ConfigService,
  ) {
    super(userServiceClient);
    this.mongoUri = configService.getOrThrow('mongoUri');
  }

  onModuleInit() {
    super.onModuleInit();
    this.collaborationService =
      this.collaborationServiceClient.getService<CollaborationServiceClient>(
        COLLABORATION_SERVICE_NAME,
      );
  }

  async handleConnection(connection: AuthenticatedWebsocket, request: Request) {
    const authenticated = await super.handleConnection(connection, request);

    if (!authenticated) {
      return false;
    }

    const ticketId = YjsGateway.getTicketIdFromUrl(request);
    const { sessionId } = await firstValueFrom(
      this.collaborationService.getSessionIdFromTicket({ id: ticketId }),
    );

    YjsGateway.setupYjs(connection, sessionId, this.mongoUri);
    return YjsGateway.sessionInitialized(connection);
  }

  private static setupYjs(connection, docName, mongoUri) {
    /**
     * Yjs `setupWSConnection` expects a Request object for auto room detection.
     * We are not using this feature, and can just pass in a dummy object.
     */
    const dummyRequest = new Request(new URL('https://placeholder.com'));
    setupWSConnection(connection, dummyRequest, {
      docName,
    });

    const mdb = new MongodbPersistence(mongoUri, {
      flushSize: 100,
      multipleCollections: true,
    });

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
