import { NestFactory } from '@nestjs/core';
import { QuestionModule } from './question.module';
import questionConfiguration from './config/configuration';
import { getGrpcOptions } from '@app/microservice/utils';
import { Service } from '@app/microservice/services';

async function bootstrap() {
  const { port } = questionConfiguration();
  const app = await NestFactory.createMicroservice(
    QuestionModule,
    getGrpcOptions(Service.QUESTION_SERVICE),
  );

  await app.listen();
  console.log(`Question microservice running on port ${port}`);
}
bootstrap();
