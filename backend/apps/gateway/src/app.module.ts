import { ConfigModule } from '@app/config';
import { Service } from '@app/microservice/interservice-api/services';
import { createMicroserviceClientProxyProvider } from '@app/microservice/utils';
import { Module } from '@nestjs/common';
import gatewayConfiguration from './config/configuration';
import { AppController } from './controllers/app.controller';
import { AuthController } from './controllers/auth.controller';
import { CollaborationController } from './controllers/collaboration.controller';
import { LanguagesController } from './controllers/languages.controller';
import { MatchingController } from './controllers/matching.controller';
import { MatchingWebsocketController } from './controllers/matchingWebsocket.controller';
import { UserController } from './controllers/user.controller';
import { JwtModule } from './jwt/jwt.module';
import { GoogleOauthStrategy } from './oauthProviders/google/google-oauth.strategy';
import { WebsocketMemoryService } from './services/websocketMemory.service';
import { MatchingGateway } from './websocket-gateways/matching.gateway';
import { YjsGateway } from './websocket-gateways/yjs.gateway';

const microserviceOptionKeys = {
  [Service.QUESTION_SERVICE]: 'questionServiceOptions',
  [Service.USER_SERVICE]: 'userServiceOptions',
  [Service.COLLABORATION_SERVICE]: 'collaborationServiceOptions',
  [Service.MATCHING_SERVICE]: 'matchingServiceOptions',
};
@Module({
  imports: [ConfigModule.loadConfiguration(gatewayConfiguration), JwtModule],
  controllers: [
    AppController,
    AuthController,
    UserController,
    LanguagesController,
    CollaborationController,
    CollaborationController,
    MatchingWebsocketController,
    MatchingController,
  ],
  providers: [
    GoogleOauthStrategy,
    YjsGateway,
    MatchingGateway,
    WebsocketMemoryService,
    ...Object.entries(microserviceOptionKeys).map(([key, value]) =>
      createMicroserviceClientProxyProvider(key, value),
    ),
  ],
})
export class AppModule {}
