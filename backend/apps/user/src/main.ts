import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import userConfiguration from './config/configuration';
import { getRmqOptions } from '@app/config/rmqConfiguration';

async function bootstrap() {
  const { port } = userConfiguration();
  const { userServiceOptions } = getRmqOptions();
  const app = await NestFactory.createMicroservice(
    UserModule,
    userServiceOptions,
  );
  await app.listen();
  console.log(`User microservice running on port ${port}`);
}
bootstrap();
