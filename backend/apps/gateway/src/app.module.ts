import { ConfigModule } from '@app/config';
import { Service } from '@app/microservice/services';
import { registerGrpcClients } from '@app/microservice/utils';
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
import { YjsGateway } from './websocket-gateways/yjs.gateway';

@Module({
  imports: [
    ConfigModule.loadConfiguration(gatewayConfiguration),
    JwtModule,
    registerGrpcClients([
      Service.USER_SERVICE,
      Service.QUESTION_SERVICE,
      Service.COLLABORATION_SERVICE,
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    LanguagesController,
    CollaborationController,
    MatchingWebsocketController,
    MatchingController,
  ],
  providers: [GoogleOauthStrategy, YjsGateway],
})
export class AppModule { }
