import { Module, Provider } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import matchingConfiguration from './config/configuration';
import { ConfigModule } from '@app/config';
import { SqlDatabaseModule } from '@app/sql-database';
import { LookingToMatchDaoModule } from './database/daos/lookingToMatch/lookingToMatch.dao.module';
import { MatchingService } from './matching.service';
import { LookingToMatchModel } from './database/models/lookingToMatch.model';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { Service } from '@app/microservice/interservice-api/services';

const microserviceOptionKeys = {
  [Service.QUESTION_SERVICE]: 'questionServiceOptions',
  [Service.COLLABORATION_SERVICE]: 'collaborationServiceOptions',
  [Service.WEBSOCKET_SERVICE]: 'websocketServiceOptions',
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
