import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({
      origin: process.env.CORS_ORIGIN,
      optionsSuccessStatus: 200,
    });
  }

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
