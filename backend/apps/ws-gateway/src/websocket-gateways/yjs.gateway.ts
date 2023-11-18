import { Inject, UseFilters } from '@nestjs/common';
import { SubscribeMessage, WsException } from '@nestjs/websockets';
import { setupWSConnection, setPersistence } from 'y-websocket/bin/utils';
import { Redis, RedisOptions } from 'ioredis';
import { ClientGrpc } from '@nestjs/microservices';
import { MongodbPersistence } from 'y-mongodb-provider';
import * as Y from 'yjs';
import {
  AuthenticatedWebsocket,
  BaseWebsocketGateway,
  PrefixedWebsocketGateway,
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
import { GatewayExceptionFilter } from '@app/utils';

type YjsWebsocket = AuthenticatedWebsocket & {
  redisPubClient: Redis;
  redisSubClient: Redis;
  sessionId: string;
};

@PrefixedWebsocketGateway('/yjs')
export class YjsGateway extends BaseWebsocketGateway {
  private static SESSION_INITIALIZED = 'session_initialized';
  private static CURRENT_LANGUAGE = 'current_language';
  private static LANGUAGE_CHANGE = 'language_change';
  private static SESSION_CLOSED = 'session_closed';
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
    try {
      return YjsGateway.destroyRedisPubSubClients(connection);
    } catch (e) {
      connection.onerror = () => {
        throw new WsException(e);
      };
      console.error(e);
    }
  }

  async handleConnection(connection: YjsWebsocket, request: Request) {
    try {
      const authenticated = await super.handleConnection(connection, request);
      if (!authenticated) {
        return false;
      }

      const ticketId = YjsGateway.getTicketIdFromUrl(request);
      const { session, language } = await this.getSessionAndLanguage(ticketId);
      const { id: sessionId } = session;

      if (session.isClosed) {
        return YjsGateway.closeConnection(
          connection,
          YjsGateway.SESSION_CLOSED,
        );
      }

      connection.sessionId = sessionId;
      YjsGateway.initializeRedisPubSubClients(
        connection,
        this.configService.get('websocketGatewayOptions')?.options,
      );

      this.subscribeAndHandleLanguageChange(connection, sessionId);
      this.setupYjs(connection, sessionId, this.mongoUri);
      YjsGateway.propagateLanguageToClient(connection, language);

      return YjsGateway.sessionInitialized(connection);
    } catch (e) {
      connection.onerror = () => {
        throw new WsException(e);
      };
      console.error(e);
    }
  }

  @UseFilters(GatewayExceptionFilter)
  @SubscribeMessage(YjsGateway.LANGUAGE_CHANGE)
  async handleLanguageChange(connection: YjsWebsocket, data: string) {
    try {
      const decoded: number = JSON.parse(data);

      await firstValueFrom(
        this.collaborationService.setSessionLanguageId({
          sessionId: connection.sessionId,
          languageId: decoded,
        }),
      );

      connection.redisPubClient.publish(
        CollaborationEvent.LANGUAGE_CHANGE,
        connection.sessionId,
      );
    } catch (e) {
      console.log('error handling language change', e);
    }
  }

  private static initializeRedisPubSubClients(
    connection: YjsWebsocket,
    redisOptions: RedisOptions,
  ) {
    connection.redisPubClient = new Redis(redisOptions);
    connection.redisSubClient = new Redis(redisOptions);
  }

  private static destroyRedisPubSubClients(connection: YjsWebsocket) {
    const clients = [connection.redisPubClient, connection.redisSubClient];
    clients.forEach((client) => {
      if (client) {
        client.quit();
      }
    });
  }

  private async getSessionAndLanguage(ticketId: string) {
    const session = await firstValueFrom(
      this.collaborationService.getSessionFromTicket({ id: ticketId }),
    );
    const language = await firstValueFrom(
      this.collaborationService.getLanguageIdFromSessionId({ id: session.id }),
    );
    return { session, language };
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
  private subscribeAndHandleLanguageChange(
    connection: YjsWebsocket,
    sessionId: string,
  ) {
    connection.redisSubClient.subscribe(CollaborationEvent.LANGUAGE_CHANGE);
    connection.redisSubClient.on('message', async (_, reqSessionId) => {
      if (reqSessionId == sessionId) {
        const language = await firstValueFrom(
          this.collaborationService.getLanguageIdFromSessionId({
            id: connection.sessionId,
          }),
        );

        YjsGateway.propagateLanguageToClient(connection, language);
      }
    });
  }

  private setupYjs(
    connection: YjsWebsocket,
    docName: string,
    mongoUri: string,
  ) {
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
      writeState: async (docName) => {
        // This is called when all connections to the document are closed.

        // Close collab session when all clients have disconnected
        await firstValueFrom(
          this.collaborationService.closeSession({ id: connection.sessionId }),
        );

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
