import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport } from '@nestjs/microservices';
import authConfiguration from './config/configuration';

async function bootstrap() {
  const { port } = authConfiguration();
  const app = await NestFactory.createMicroservice(AuthModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port,
    },
  });
  await app.listen();
  console.log(`Auth microservice running on port ${port}`);
}
bootstrap();
