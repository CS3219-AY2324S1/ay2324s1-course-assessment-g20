import { Inject } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { setupWSConnection, setPersistence } from 'y-websocket/bin/utils';
import { Redis } from 'ioredis';
import { ClientGrpc } from '@nestjs/microservices';
import { MongodbPersistence } from 'y-mongodb-provider';
import * as Y from 'yjs';
import {
  AuthenticatedWebsocket,
  BaseWebsocketGateway,
  RedisAwareWebsocket,
} from '@app/websocket';
import { Service } from '@app/microservice/services';
import {
  COLLABORATION_SERVICE_NAME,
  CollaborationServiceClient,
} from '@app/microservice/interfaces/collaboration';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CollaborationEvent } from '@app/microservice/events-api/collaboration';
import { Language } from '@app/microservice/interfaces/user';

type YjsWebsocket = AuthenticatedWebsocket & RedisAwareWebsocket;

@WebSocketGateway({ path: '/yjs' })
export class YjsGateway extends BaseWebsocketGateway {
  private static SESSION_INITIALIZED = 'session_initialized';
  private static CURRENT_LANGUAGE = 'current_language';
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
  async handleDisconnect(connection: YjsWebsocket): Promise<void> {
    if (connection.redisClient) {
      // unsubscribe from redis pub sub when connection is closed, to prevent memory leak
      connection.redisClient.quit();
    }
  }

  async handleConnection(connection: YjsWebsocket, request: Request) {
    const authenticated = await super.handleConnection(connection, request);
    if (!authenticated) {
      return false;
    }

    const ticketId = YjsGateway.getTicketIdFromUrl(request);
    const { sessionId, language } = await this.getSessionIdAndLanguage(
      ticketId,
    );
    const docName = sessionId + language.id;

    YjsGateway.propagateLanguageToClient(connection, language);
    YjsGateway.subscribeAndHandleLanguageChange(connection, sessionId);
    YjsGateway.setupYjs(connection, docName, this.mongoUri);

    return YjsGateway.sessionInitialized(connection);
  }

  private async getSessionIdAndLanguage(ticketId: string) {
    const { sessionId } = await firstValueFrom(
      this.collaborationService.getSessionIdFromTicket({ id: ticketId }),
    );
    const language = await firstValueFrom(
      this.collaborationService.getLanguageIdFromSessionId({ id: sessionId }),
    );
    return { sessionId, language };
  }

  private static propagateLanguageToClient(
    connection: YjsWebsocket,
    language: Language,
  ) {
    return connection.send(
      JSON.stringify({ event: YjsGateway.CURRENT_LANGUAGE, language }),
    );
  }

  // listen to redis pub sub message for any request to change the language
  private static subscribeAndHandleLanguageChange(
    connection: YjsWebsocket,
    sessionId: string,
  ) {
    const redisClient = new Redis();
    connection.redisClient = redisClient;
    redisClient.subscribe(CollaborationEvent.LANGUAGE_CHANGE);
    redisClient.on('message', (_, reqSessionId) => {
      if (reqSessionId == sessionId) {
        // Lets client know to reload session language and rebind monaco to a new ws connection
        connection.send(CollaborationEvent.LANGUAGE_CHANGE);
      }
    });
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
        const persistedYdoc: Y.Doc = await mdb.getYDoc(docName);
        const persistedStateVector: Uint8Array =
          Y.encodeStateVector(persistedYdoc);
        const diff: Uint8Array = Y.encodeStateAsUpdate(
          ydoc,
          persistedStateVector,
        );

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
        // const yText = ydoc.getText('monaco').toString();
        // history service method (sessionId, yText);

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
