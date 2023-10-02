import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import matchingConfiguration from './config/configuration';
import { ConfigModule } from '@app/config';
import { SqlDatabaseModule } from '@app/sql-database';
import { LookingToMatchDaoModule } from './database/daos/lookingToMatch/lookingToMatch.dao.module';
import { MatchingService } from './matching.service';
import { LookingToMatchModel } from './database/models/lookingToMatch.model';
import { WEBSOCKET_SERVICE } from '@app/interservice-api/gateway';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { MatchingWsTicketDaoModule } from './database/daos/matchingWsTicket/matchingWsTicket.dao.module';
import { MatchingWsTicketModel } from './database/models/matchingWsTicket.model';
@Module({
  imports: [
    ConfigModule.loadConfiguration(matchingConfiguration),
    SqlDatabaseModule.factory([LookingToMatchModel, MatchingWsTicketModel]),
    LookingToMatchDaoModule,
    MatchingWsTicketDaoModule,
  ],
  controllers: [MatchingController],
  providers: [
    MatchingService,
    {
      provide: WEBSOCKET_SERVICE,
      useFactory: (configService: ConfigService) => {
        const websocketServiceOptions = configService.get(
          'websocketServiceOptions',
        );
        return ClientProxyFactory.create(websocketServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class MatchingModule {}
