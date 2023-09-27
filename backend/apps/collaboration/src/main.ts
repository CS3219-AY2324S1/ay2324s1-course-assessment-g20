import { NestFactory } from '@nestjs/core';
import { CollaborationModule } from './collaboration.module';
import { Transport } from '@nestjs/microservices';
import collaborationConfiguration from './config/configuration';
import { RmqQueue } from '@app/types/rmqQueues';

async function bootstrap() {
  const { port, rmqUrl } = collaborationConfiguration();
  const app = await NestFactory.createMicroservice(CollaborationModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: RmqQueue.COLLABORATION,
    },
  });
  await app.listen();
  console.log(`Collaboration microservice running on port ${port}`);
}
bootstrap();
