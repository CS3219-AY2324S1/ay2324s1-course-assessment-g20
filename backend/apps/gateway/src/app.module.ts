import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { ClientProxyFactory } from '@nestjs/microservices';
import gatewayConfiguration from './config/configuration';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@app/config';
import { JwtModule } from './jwt/jwt.module';
import { AuthController } from './controllers/auth.controller';
import { GoogleOauthStrategy } from './oauthProviders/google/google-oauth.strategy';
import { AUTH_SERVICE } from '@app/interservice-api/auth';
import { QUESTION_SERVICE } from '@app/interservice-api/question';

@Module({
  imports: [ConfigModule.loadConfiguration(gatewayConfiguration), JwtModule],
  controllers: [AppController, AuthController],
  providers: [
    GoogleOauthStrategy,
    {
      provide: QUESTION_SERVICE,
      useFactory: (configService: ConfigService) => {
        const questionServiceOptions = configService.get(
          'questionServiceOptions',
        );
        return ClientProxyFactory.create(questionServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: AUTH_SERVICE,
      useFactory: (configService: ConfigService) => {
        const authServiceOptions = configService.get('authServiceOptions');
        return ClientProxyFactory.create(authServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
