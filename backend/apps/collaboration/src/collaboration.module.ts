import { Module } from '@nestjs/common';
import { CollaborationController } from './collaboration.controller';
import { CollaborationService } from './collaboration.service';
import { ConfigModule } from '@app/config';
import collaborationConfiguration from './config/configuration';
import { SqlDatabaseModule } from '@app/sql-database';
import { CollabSessionWsTicketModel } from './database/models/collabSessionWsTicket.model';
import { CollabSessionWsTicketDaoModule } from './database/daos/collabSessionWsTicket/collabSessionWsTicket.dao.module';
import { SessionModel } from './database/models/session.model';
import { UserSessionModel } from './database/models/userSession.model';
import { SessionDaoModule } from './database/daos/session/session.dao.module';

@Module({
  imports: [
    ConfigModule.loadConfiguration(collaborationConfiguration),

    // Database and DAOs
    SqlDatabaseModule.factory([
      CollabSessionWsTicketModel,
      SessionModel,
      UserSessionModel,
    ]),
    CollabSessionWsTicketDaoModule,
    SessionDaoModule,
  ],
  controllers: [CollaborationController],
  providers: [CollaborationService],
})
export class CollaborationModule {}
