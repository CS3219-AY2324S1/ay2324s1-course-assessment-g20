import { NestFactory } from '@nestjs/core';
import { WsGatewayModule } from './ws-gateway.module';
import { ConfigService } from '@nestjs/config';
import { WsAdapter } from '@nestjs/platform-ws';
import { VersioningType } from '@nestjs/common';
import { GatewayExceptionFilter } from '@app/utils';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(WsGatewayModule);

  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(new WsAdapter(app));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  if (configService.get('NODE_ENV') === 'development') {
    app.enableCors();
  } else {
    app.enableCors({
      origin: configService.get('CORS_ORIGIN'),
      optionsSuccessStatus: 200,
    });
  }

  app.useGlobalFilters(new GatewayExceptionFilter());

  const websocketGatewayOptions = configService.get('websocketGatewayOptions');
  app.connectMicroservice<MicroserviceOptions>(websocketGatewayOptions);
  await app.startAllMicroservices();

  const port = configService.get('port');
  await app.listen(port);
  console.log(`Websocket Gateway running on port ${port}`);
}
bootstrap();
