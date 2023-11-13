import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GatewayExceptionFilter } from '@app/utils/exceptionFilter/gateway-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

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

  app.useGlobalFilters(new GatewayExceptionFilter());

  const port = configService.get('port');
  await app.listen(port);
  console.log(`HTTP Gateway running on port ${port}`);
}
bootstrap();
