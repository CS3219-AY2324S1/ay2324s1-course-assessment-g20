import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { RmqOptions, Transport } from '@nestjs/microservices';
import userConfiguration from './config/configuration';
import { RmqQueue } from '@app/types/rmqQueues';

async function bootstrap() {
  const { port, rmqUrl } = userConfiguration();
  const app = await NestFactory.createMicroservice(UserModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: RmqQueue.USER,
    },
  } as RmqOptions);
  await app.listen();
  console.log(`User microservice running on port ${port}`);
}
bootstrap();
