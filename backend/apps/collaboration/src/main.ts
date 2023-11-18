import { NestFactory } from '@nestjs/core';
import { CollaborationModule } from './collaboration.module';
import collaborationConfiguration from './config/configuration';
import { getGrpcOptions } from '@app/microservice/utils';
import { Service } from '@app/microservice/services';

async function bootstrap() {
  const { port } = collaborationConfiguration();
  const app = await NestFactory.createMicroservice(
    CollaborationModule,
    getGrpcOptions(Service.COLLABORATION_SERVICE),
  );
  await app.listen();
  console.log(`Collaboration microservice running on port ${port}`);
}
bootstrap();
