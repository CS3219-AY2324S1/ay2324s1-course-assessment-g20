import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import matchingConfiguration from './config/configuration';
import { ConfigModule } from '@app/config';
import { SqlDatabaseModule } from '@app/sql-database';
import { LookingToMatchDaoModule } from './database/daos/lookingToMatch/lookingToMatch.dao.module';
import { MatchingService } from './matching.service';
import { LookingToMatchModel } from './database/models/lookingToMatch.model';
import { Service } from '@app/microservice/interservice-api/services';
import { createMicroserviceClientProxyProvider } from '@app/microservice/utils';

const microserviceOptionKeys = {
  [Service.QUESTION_SERVICE]: 'questionServiceOptions',
  [Service.COLLABORATION_SERVICE]: 'collaborationServiceOptions',
  [Service.WEBSOCKET_SERVICE]: 'websocketServiceOptions',
};

@Module({
  imports: [
    ConfigModule.loadConfiguration(matchingConfiguration),
    SqlDatabaseModule.factory([LookingToMatchModel]),
    LookingToMatchDaoModule,
  ],
  controllers: [MatchingController],
  providers: [
    MatchingService,
    ...Object.entries(microserviceOptionKeys).map(([key, value]) =>
      createMicroserviceClientProxyProvider(key, value),
    ),
  ],
})
export class MatchingModule {}
