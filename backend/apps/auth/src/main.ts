import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import authConfiguration from './config/configuration';
import { getRmqOptions } from '@app/config/rmqConfiguration';

async function bootstrap() {
  const { port } = authConfiguration();
  const { authServiceOptions } = getRmqOptions();
  const app = await NestFactory.createMicroservice(AuthModule, authServiceOptions);
  await app.listen();
  console.log(`Auth microservice running on port ${port}`);
}
bootstrap();
