import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientProxyFactory } from '@nestjs/microservices';
import gatewayConfiguration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [gatewayConfiguration],
      envFilePath:
        process.env.NODE_ENV === undefined // during development
          ? '../.env'
          : process.env.NODE_ENV === 'test' // during testing
          ? '../.env.test'
          : undefined,
    }),
  ],
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
