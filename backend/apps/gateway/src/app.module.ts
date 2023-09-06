import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientProxyFactory } from '@nestjs/microservices';
import gatewayConfiguration from './config/configuration';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@app/config';

@Module({
  imports: [ConfigModule.loadConfiguration(gatewayConfiguration)],
  controllers: [AppController],
  providers: [
    {
      provide: 'QUESTION_SERVICE',
      useFactory: (configService: ConfigService) => {
        const questionServiceOptions = configService.get('questionService');
        return ClientProxyFactory.create(questionServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
