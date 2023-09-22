import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { Transport } from '@nestjs/microservices';
import userConfiguration from './config/configuration';

async function bootstrap() {
  const { port } = userConfiguration();
  const app = await NestFactory.createMicroservice(UserModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port,
    },
  });
  await app.listen();
  console.log(`User microservice running on port ${port}`);
}
bootstrap();
