import { NestFactory } from '@nestjs/core';
import { QuestionModule } from './question.module';
import questionConfiguration from './config/configuration';
import { getRmqOptions } from '@app/config/rmqConfiguration';

async function bootstrap() {
  const { port } = questionConfiguration();
  const { questionServiceOptions } = getRmqOptions();
  const app = await NestFactory.createMicroservice(QuestionModule, questionServiceOptions);
  await app.listen();
  console.log(`Question microservice running on port ${port}`);
}
bootstrap();
