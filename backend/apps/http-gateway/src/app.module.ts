import { ConfigModule } from '@app/config';
import { Service } from '@app/microservice/services';
import { registerGrpcClients } from '@app/microservice/utils';
import { Module } from '@nestjs/common';
import httpGatewayConfiguration from './config/configuration';
import { QuestionController } from './controllers/question.controller';
import { AuthController } from './controllers/auth.controller';
import { LanguagesController } from './controllers/languages.controller';
import { UserController } from './controllers/user.controller';
import { AppController } from './controllers/app.controller';

@Module({
  imports: [
    ConfigModule.loadConfiguration(httpGatewayConfiguration),
    registerGrpcClients([Service.USER_SERVICE, Service.QUESTION_SERVICE]),
  ],
  controllers: [
    AppController,
    QuestionController,
    AuthController,
    UserController,
    LanguagesController,
  ],
  providers: [],
})
export class AppModule {}
