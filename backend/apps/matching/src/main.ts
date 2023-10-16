import { NestFactory } from '@nestjs/core';
import { MatchingModule } from './matching.module';
import matchingConfiguration from './config/configuration';
import { getGrpcOptions } from '@app/microservice/utils';
import { Service } from '@app/microservice/services';

async function bootstrap() {
  const { port } = matchingConfiguration();
  const app = await NestFactory.createMicroservice(
    MatchingModule,
    getGrpcOptions(Service.MATCHING_SERVICE),
  );

  await app.listen();
  console.log(`Matching microservice running on port ${port}`);
}
bootstrap();
