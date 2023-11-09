import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import chatbotConfiguration from './config/configuration';
import { ConfigModule } from '@app/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatHistory, ChatHistorySchema } from './schemas/chatHistory.schema';
import { ConfigService } from '@nestjs/config';
import { registerGrpcClients } from '@app/microservice/utils';
import { Service } from '@app/microservice/services';
import { ChatbotService } from './chatbot.service';

@Module({
  imports: [
    ConfigModule.loadConfiguration(chatbotConfiguration),
    registerGrpcClients([
      Service.QUESTION_SERVICE,
      Service.COLLABORATION_SERVICE,
    ]),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('mongoUri'),
        authSource: 'admin',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: ChatHistory.name,
        schema: ChatHistorySchema,
      },
    ]),
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
