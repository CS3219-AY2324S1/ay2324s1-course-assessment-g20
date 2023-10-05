import { NestFactory } from '@nestjs/core';
import { CollaborationModule } from './collaboration.module';
import collaborationConfiguration from './config/configuration';
import { RmqQueue, getRmqOptionsForQueue } from '@app/microservice/utils';

async function bootstrap() {
  const { port } = collaborationConfiguration();
  const app = await NestFactory.createMicroservice(
    CollaborationModule,
    getRmqOptionsForQueue(RmqQueue.COLLABORATION),
  );
  await app.listen();
  console.log(`Collaboration microservice running on port ${port}`);
}
bootstrap();
