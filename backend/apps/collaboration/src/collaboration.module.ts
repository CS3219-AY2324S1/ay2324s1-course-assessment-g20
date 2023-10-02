import { Module, Provider } from '@nestjs/common';
import { CollaborationController } from './collaboration.controller';
import { CollaborationService } from './collaboration.service';
import { ConfigModule } from '@app/config';
import collaborationConfiguration from './config/configuration';
import { SqlDatabaseModule } from '@app/sql-database';
import { SessionModel } from './database/models/session.model';
import { UserSessionModel } from './database/models/userSession.model';
import { SessionDaoModule } from './database/daos/session/session.dao.module';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { QUESTION_SERVICE } from '@app/interservice-api/question';
import { AUTH_SERVICE } from '@app/interservice-api/auth';
import { SessionTicketModel } from './database/models/sessionTicket.model';

const microserviceOptionKeys = {
  [AUTH_SERVICE]: 'authServiceOptions',
  [QUESTION_SERVICE]: 'questionServiceOptions',
};

const createMicroserviceClientProxyProvider = (
  microservice: string,
  optionsKey: string,
): Provider => ({
  provide: microservice,
  useFactory: (configService: ConfigService) => {
    const microserviceOptions = configService.get(optionsKey);
    return ClientProxyFactory.create(microserviceOptions);
  },
  inject: [ConfigService],
});

@Module({
  imports: [
    ConfigModule.loadConfiguration(collaborationConfiguration),

    // Database and DAOs
    SqlDatabaseModule.factory([
      SessionModel,
      UserSessionModel,
      SessionTicketModel,
    ]),
    SessionDaoModule,
  ],
  controllers: [CollaborationController],
  providers: [
    CollaborationService,
    ...Object.entries(microserviceOptionKeys).map(([key, value]) =>
      createMicroserviceClientProxyProvider(key, value),
    ),
  ],
})
export class CollaborationModule {}
