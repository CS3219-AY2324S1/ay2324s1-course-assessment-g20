import { Module } from '@nestjs/common';
import { CollaborationController } from './collaboration.controller';
import { CollaborationService } from './collaboration.service';
import { ConfigModule } from '@app/config';
import collaborationConfiguration from './config/configuration';
import { SqlDatabaseModule } from '@app/sql-database';
import { SessionModel } from './database/models/session.model';
import { UserSessionModel } from './database/models/userSession.model';
import { SessionDaoModule } from './database/daos/session/session.dao.module';
import { SessionTicketModel } from './database/models/sessionTicket.model';
import { Service } from '@app/microservice/services';
import { registerGrpcClients } from '@app/microservice/utils';

@Module({
  imports: [
    ConfigModule.loadConfiguration(collaborationConfiguration),
    registerGrpcClients([Service.USER_SERVICE, Service.QUESTION_SERVICE]),

    // Database and DAOs
    SqlDatabaseModule.factory([
      SessionModel,
      UserSessionModel,
      SessionTicketModel,
    ]),
    SessionDaoModule,
  ],
  controllers: [CollaborationController],
  providers: [CollaborationService],
})
export class CollaborationModule {}
