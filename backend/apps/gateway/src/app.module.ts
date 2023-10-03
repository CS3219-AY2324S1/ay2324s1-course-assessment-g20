import { Module, Provider } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { ClientProxyFactory } from '@nestjs/microservices';
import gatewayConfiguration from './config/configuration';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@app/config';
import { JwtModule } from './jwt/jwt.module';
import { AuthController } from './controllers/auth.controller';
import { GoogleOauthStrategy } from './oauthProviders/google/google-oauth.strategy';
import { YjsGateway } from './websocket-gateways/yjs.gateway';
import { AUTH_SERVICE } from '@app/interservice-api/auth';
import { QUESTION_SERVICE } from '@app/interservice-api/question';
import { WebsocketMemoryService } from './services/websocketMemory.service';
import { MATCHING_SERVICE } from '@app/interservice-api/matching';
import { MatchingWebsocketController } from './controllers/matchingWebsocket.controller';
import { CollaborationController } from './controllers/collaboration.controller';
import { COLLABORATION_SERVICE } from '@app/interservice-api/collaboration';
import { MatchingGateway } from './websocket-gateways/matching.gateway';
import { MatchingController } from './controllers/matching.controller';

const microserviceOptionKeys = {
  [AUTH_SERVICE]: 'authServiceOptions',
  [QUESTION_SERVICE]: 'questionServiceOptions',
  [COLLABORATION_SERVICE]: 'collaborationServiceOptions',
  [MATCHING_SERVICE]: 'matchingServiceOptions',
};
const createMicroserviceClientProxyProvider = (
  microservice: string,
  optionsKey: string,
): Provider => ({
  provide: microservice,
  useFactory: (configService: ConfigService) => {
    const microserviceOptions = configService.get(optionsKey);
    return ClientProxyFactory.create(microserviceOptions);
  },
  inject: [ConfigService],
});
@Module({
  imports: [ConfigModule.loadConfiguration(gatewayConfiguration), JwtModule],
  controllers: [
    AppController,
    AuthController,
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
