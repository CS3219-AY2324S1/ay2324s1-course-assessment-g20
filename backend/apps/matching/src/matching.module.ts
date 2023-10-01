import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import matchingConfiguration from './config/configuration';
import { ConfigModule } from '@app/config';
import { SqlDatabaseModule } from '@app/sql-database';
import { ScheduleModule } from '@nestjs/schedule';
import { LookingToMatchDaoModule } from './database/daos/lookingToMatch.dao.module';
import { MatchingService } from './matching.service';
import { LookingToMatchModel } from './database/models/lookingToMatch.model';
import { WEBSOCKET_SERVICE } from '@app/interservice-api/gateway';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
@Module({
  imports: [
    ConfigModule.loadConfiguration(matchingConfiguration),
    SqlDatabaseModule.factory([LookingToMatchModel]),
    ScheduleModule.forRoot(),
    LookingToMatchDaoModule,
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
