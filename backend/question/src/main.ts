import { NestFactory } from '@nestjs/core';
import { QuestionModule } from './question.module';
import { TcpOptions, Transport } from '@nestjs/microservices';
import questionConfiguration from './config/configuration';

async function bootstrap() {
  const { port } = questionConfiguration();
  const app = await NestFactory.createMicroservice(QuestionModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port,
    },
  } as TcpOptions);

  await app.listen();
  console.log(`Question microservice running on port ${port}`);
}
bootstrap();
