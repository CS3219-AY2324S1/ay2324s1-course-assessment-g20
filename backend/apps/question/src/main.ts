import { NestFactory } from '@nestjs/core';
import { QuestionModule } from './question.module';
import questionConfiguration from './config/configuration';
import { getRmqOptionsForQueue } from '@app/config/rmqConfiguration';
import { RmqQueue } from '@app/types/rmqQueues';

async function bootstrap() {
  const { port } = questionConfiguration();
  const app = await NestFactory.createMicroservice(
    QuestionModule,
    getRmqOptionsForQueue(RmqQueue.QUESTION),
  );
  await app.listen();
  console.log(`Question microservice running on port ${port}`);
}
bootstrap();
