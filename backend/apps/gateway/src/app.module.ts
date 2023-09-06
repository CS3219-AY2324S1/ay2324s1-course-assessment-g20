import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientProxyFactory } from '@nestjs/microservices';
import gatewayConfiguration from './config/configuration';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@app/config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './jwt/jwt.guard';

@Module({
  imports: [ConfigModule.loadConfiguration(gatewayConfiguration)],
  controllers: [AppController],
  providers: [
    JwtStrategy,
    {
      // Global JWT app guard. Lets through endpoints with @Public decorator.
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: 'QUESTION_SERVICE',
      useFactory: (configService: ConfigService) => {
        const questionServiceOptions = configService.get(
          'questionServiceOptions',
        );
        return ClientProxyFactory.create(questionServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {
        const authServiceOptions = configService.get('authServiceOptions');
        return ClientProxyFactory.create(authServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
