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
import { CollaborationController } from './controllers/collaboration.controller';
import { COLLABORATION_SERVICE } from '@app/interservice-api/collaboration';

const microserviceOptionKeys = {
  [AUTH_SERVICE]: 'authServiceOptions',
  [QUESTION_SERVICE]: 'questionServiceOptions',
  [COLLABORATION_SERVICE]: 'collaborationServiceOptions',
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
  controllers: [AppController, AuthController, CollaborationController],
  providers: [
    GoogleOauthStrategy,
    ...Object.entries(microserviceOptionKeys).map(([key, value]) =>
      createMicroserviceClientProxyProvider(key, value),
    ),
    YjsGateway,
  ],
})
export class AppModule {}
