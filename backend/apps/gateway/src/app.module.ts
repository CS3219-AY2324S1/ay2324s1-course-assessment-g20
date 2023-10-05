import { Module } from '@nestjs/common';
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
import { Service } from '@app/interservice-api/services';

@Module({
  imports: [ConfigModule.loadConfiguration(gatewayConfiguration), JwtModule],
  controllers: [
    AppController,
    AuthController,
    UserController,
    LanguagesController,
  ],
  providers: [
    GoogleOauthStrategy,
    {
      provide: Service.QUESTION_SERVICE,
      useFactory: (configService: ConfigService) => {
        const questionServiceOptions = configService.get(
          'questionServiceOptions',
        );
        return ClientProxyFactory.create(questionServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: Service.USER_SERVICE,
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get('userServiceOptions');
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
