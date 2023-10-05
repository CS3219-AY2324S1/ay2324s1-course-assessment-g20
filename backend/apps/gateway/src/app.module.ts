import { Module, Provider } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { ClientProxyFactory } from '@nestjs/microservices';
import gatewayConfiguration from './config/configuration';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@app/config';
import { JwtModule } from './jwt/jwt.module';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { LanguagesController } from './controllers/languages.controller';
import { GoogleOauthStrategy } from './oauthProviders/google/google-oauth.strategy';
import { YjsGateway } from './websocket-gateways/yjs.gateway';
import { CollaborationController } from './controllers/collaboration.controller';
import { Service } from '@app/microservice/interservice-api/services';

const microserviceOptionKeys = {
  [Service.QUESTION_SERVICE]: 'questionServiceOptions',
  [Service.USER_SERVICE]: 'userServiceOptions',
  [Service.COLLABORATION_SERVICE]: 'collaborationServiceOptions',
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
