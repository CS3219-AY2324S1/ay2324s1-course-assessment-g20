import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsAdapter } from '@nestjs/platform-ws';
import {
  MicroserviceOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { RmqQueue } from '@app/microservice/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(new WsAdapter(app));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      whitelist: true,
    }),
  );

  if (configService.get('NODE_ENV') === 'development') {
    app.enableCors();
  } else {
    app.enableCors({
      origin: configService.get('CORS_ORIGIN'),
      optionsSuccessStatus: 200,
    });
  }

  const port = configService.get('port');
  const rmqUrl = configService.get('rmqUrl');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: RmqQueue.WEBSOCKET,
    },
  } as RmqOptions);

  await app.startAllMicroservices();

  await app.listen(port);
  console.log(`Gateway running on port ${port}`);
}
bootstrap();
