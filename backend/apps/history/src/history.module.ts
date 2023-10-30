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

@Module({
  imports: [
    ConfigModule.loadConfiguration(historyConfiguration),
    registerGrpcClients([Service.QUESTION_SERVICE]),
    SqlDatabaseModule.factory([HistoryModel, AttemptModel]),
  ],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
