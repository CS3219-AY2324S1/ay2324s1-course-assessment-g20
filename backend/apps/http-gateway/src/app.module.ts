import { ConfigModule } from '@app/config';
import { Service } from '@app/microservice/services';
import { registerGrpcClients } from '@app/microservice/utils';
import { RolesModule } from './roles/roles.module';
import { Module } from '@nestjs/common';
import httpGatewayConfiguration from './config/configuration';
import { QuestionController } from './controllers/question.controller';
import { AuthController } from './controllers/auth.controller';
import { LanguagesController } from './controllers/languages.controller';
import { UserController } from './controllers/user.controller';
import { JwtModule } from './jwt/jwt.module';
import { GoogleOauthStrategy } from './oauthProviders/google/google-oauth.strategy';
import { AppController } from './controllers/app.controller';

@Module({
  imports: [
    ConfigModule.loadConfiguration(httpGatewayConfiguration),
    JwtModule,
    RolesModule,
    registerGrpcClients([Service.USER_SERVICE, Service.QUESTION_SERVICE]),
  ],
  controllers: [
    AppController,
    QuestionController,
    AuthController,
    UserController,
    LanguagesController,
  ],
  providers: [GoogleOauthStrategy],
})
export class AppModule {}
