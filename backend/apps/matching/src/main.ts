import { NestFactory } from '@nestjs/core';
import { MatchingModule } from './matching.module';
import { RmqOptions, Transport } from '@nestjs/microservices';
import matchingConfiguration from './config/configuration';
import { RmqQueue } from '@app/types/rmqQueues';

async function bootstrap() {
  const { port, rmqUrl } = matchingConfiguration();
  const app = await NestFactory.createMicroservice(MatchingModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: RmqQueue.MATCHING,
    },
  } as RmqOptions);

  await app.listen();
  console.log(`Matching microservice running on port ${port}`);
}
bootstrap();
