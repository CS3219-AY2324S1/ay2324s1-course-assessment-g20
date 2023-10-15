import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import matchingConfiguration from './config/configuration';
import { ConfigModule } from '@app/config';
import { SqlDatabaseModule } from '@app/sql-database';
import { LookingToMatchDaoModule } from './database/daos/lookingToMatch/lookingToMatch.dao.module';
import { MatchingService } from './matching.service';
import { LookingToMatchModel } from './database/models/lookingToMatch.model';
import { Service } from '@app/microservice/services';
import {
  createMicroserviceClientProxyProvider,
  registerGrpcClients,
} from '@app/microservice/utils';

@Module({
  imports: [
    ConfigModule.loadConfiguration(matchingConfiguration),
    registerGrpcClients([
      Service.QUESTION_SERVICE,
      Service.COLLABORATION_SERVICE,
    ]),
    SqlDatabaseModule.factory([LookingToMatchModel]),
    LookingToMatchDaoModule,
  ],
  controllers: [MatchingController],
  providers: [
    MatchingService,
    createMicroserviceClientProxyProvider(
      Service.WEBSOCKET_SERVICE,
      'websocketServiceOptions',
    ),
  ],
})
export class MatchingModule {}
