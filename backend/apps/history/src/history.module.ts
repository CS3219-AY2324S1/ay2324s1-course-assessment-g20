import { ConfigModule } from '@app/config';
import { Module } from '@nestjs/common';
import historyConfiguration from './config/configuration';
import { registerGrpcClients } from '@app/microservice/utils';
import { Service } from '@app/microservice/services';
import { SqlDatabaseModule } from '@app/sql-database';
import { AttemptModel } from './database/models/attempt.model';
import { HistoryModel } from './database/models/history.model';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { HistoryDaoModule } from './database/daos/history/history.dao.module';
import { AttemptDaoModule } from './database/daos/attempt/attempt.dao.module';

@Module({
  imports: [
    ConfigModule.loadConfiguration(historyConfiguration),
    registerGrpcClients([
      Service.QUESTION_SERVICE,
      Service.USER_SERVICE,
      Service.COLLABORATION_SERVICE,
    ]),
    // Database and DAOs
    SqlDatabaseModule.factory([HistoryModel, AttemptModel]),
    HistoryDaoModule,
    AttemptDaoModule,
  ],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
