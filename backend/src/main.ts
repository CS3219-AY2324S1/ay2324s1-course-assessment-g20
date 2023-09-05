import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
