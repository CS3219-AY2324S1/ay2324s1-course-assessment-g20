import { ConfigModule } from '@app/config';
import { Service } from '@app/microservice/services';
import { registerGrpcClients } from '@app/microservice/utils';
import { Module } from '@nestjs/common';
import httpGatewayConfiguration from './config/configuration';
import { QuestionController } from './controllers/question.controller';
import { AppController } from './controllers/app.controller';

@Module({
  imports: [
    ConfigModule.loadConfiguration(httpGatewayConfiguration),
    registerGrpcClients([Service.QUESTION_SERVICE]),
  ],
  controllers: [AppController, QuestionController],
  providers: [],
})
export class AppModule {}
