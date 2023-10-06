import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import gatewayConfiguration from './config/configuration';
import { ConfigModule } from '@app/config';
import { JwtModule } from './jwt/jwt.module';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { LanguagesController } from './controllers/languages.controller';
import { GoogleOauthStrategy } from './oauthProviders/google/google-oauth.strategy';
import { YjsGateway } from './websocket-gateways/yjs.gateway';
import { CollaborationController } from './controllers/collaboration.controller';
import { Service } from '@app/microservice/interservice-api/services';
import { createMicroserviceClientProxyProvider } from '@app/microservice/utils';

const microserviceOptionKeys = {
  [Service.QUESTION_SERVICE]: 'questionServiceOptions',
  [Service.USER_SERVICE]: 'userServiceOptions',
  [Service.COLLABORATION_SERVICE]: 'collaborationServiceOptions',
};

@Module({
  imports: [ConfigModule.loadConfiguration(gatewayConfiguration), JwtModule],
  controllers: [
    AppController,
    AuthController,
    UserController,
    LanguagesController,
    CollaborationController,
  ],
  providers: [
    GoogleOauthStrategy,
    YjsGateway,
    ...Object.entries(microserviceOptionKeys).map(([key, value]) =>
      createMicroserviceClientProxyProvider(key, value),
    ),
  ],
})
export class AppModule {}
