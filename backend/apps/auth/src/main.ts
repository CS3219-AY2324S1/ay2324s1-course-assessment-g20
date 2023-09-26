import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import authConfiguration from './config/configuration';
import { getRmqOptionsForQueue } from '@app/config/rmqConfiguration';
import { RmqQueue } from '@app/types/rmqQueues';

async function bootstrap() {
  const { port } = authConfiguration();
  const app = await NestFactory.createMicroservice(
    AuthModule,
    getRmqOptionsForQueue(RmqQueue.AUTH),
  );
  await app.listen();
  console.log(`Auth microservice running on port ${port}`);
}
bootstrap();
