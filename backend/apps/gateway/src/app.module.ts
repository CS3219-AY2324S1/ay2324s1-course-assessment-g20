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
import { Service } from '@app/microservice/services';
import { registerGrpcClients } from '@app/microservice/utils';
import { RolesModule } from './roles/roles.module';
import { APP_FILTER } from '@nestjs/core';
import { GatewayExceptionFilter } from 'libs/exception-filter/gateway-exception.filter';

@Module({
  imports: [
    ConfigModule.loadConfiguration(gatewayConfiguration),
    JwtModule,
    RolesModule,
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
  ],
  providers: [
    GoogleOauthStrategy,
    YjsGateway,
    {
      provide: APP_FILTER,
      useClass: GatewayExceptionFilter,
    },
  ],
})
export class AppModule {}
