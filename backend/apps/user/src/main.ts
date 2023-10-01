import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import userConfiguration from './config/configuration';
import { getRmqOptionsForQueue } from '@app/config/rmqConfiguration';
import { RmqQueue } from '@app/types/rmqQueues';

async function bootstrap() {
  const { port } = userConfiguration();
  const app = await NestFactory.createMicroservice(
    UserModule,
    getRmqOptionsForQueue(RmqQueue.USER),
  );
  await app.listen();
  console.log(`User microservice running on port ${port}`);
}
bootstrap();