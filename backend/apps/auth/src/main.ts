import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { RmqOptions, Transport } from '@nestjs/microservices';
import authConfiguration from './config/configuration';
import { RmqQueue } from '@app/types/rmqQueues';

async function bootstrap() {
  const { port, rmqUrl } = authConfiguration();
  const app = await NestFactory.createMicroservice(AuthModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: RmqQueue.AUTH,
    },
  } as RmqOptions);
  await app.listen();
  console.log(`Auth microservice running on port ${port}`);
}
bootstrap();
