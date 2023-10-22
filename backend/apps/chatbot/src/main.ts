import { NestFactory } from '@nestjs/core';
import { ChatbotModule } from './chatbot.module';
import chatbotConfiguration from './config/configuration';
import { getGrpcOptions } from '@app/microservice/utils';
import { Service } from '@app/microservice/services';

async function bootstrap() {
  const { port } = chatbotConfiguration();
  const app = await NestFactory.createMicroservice(
    ChatbotModule,
    getGrpcOptions(Service.CHATBOT_SERVICE),
  );

  await app.listen();
  console.log(`Chatbot microservice running on port ${port}`);
}
bootstrap();
