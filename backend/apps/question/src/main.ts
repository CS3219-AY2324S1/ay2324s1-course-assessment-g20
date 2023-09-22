import { NestFactory } from '@nestjs/core';
import { QuestionModule } from './question.module';
import { RmqOptions, Transport } from '@nestjs/microservices';
import questionConfiguration from './config/configuration';
import { RmqQueue } from '@app/types/rmqQueues';

async function bootstrap() {
  const { port, rmqUrl } = questionConfiguration();
  const app = await NestFactory.createMicroservice(QuestionModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: RmqQueue.QUESTION,
    },
  } as RmqOptions);

  await app.listen();
  console.log(`Question microservice running on port ${port}`);
}
bootstrap();
