import { NestFactory } from '@nestjs/core';
import { MatchingModule } from './matching.module';
import matchingConfiguration from './config/configuration';
import { RmqQueue, getRmqOptionsForQueue } from '@app/microservice/utils';

async function bootstrap() {
  const { port } = matchingConfiguration();
  const app = await NestFactory.createMicroservice(
    MatchingModule,
    getRmqOptionsForQueue(RmqQueue.MATCHING),
  );

  await app.listen();
  console.log(`Matching microservice running on port ${port}`);
}
bootstrap();
