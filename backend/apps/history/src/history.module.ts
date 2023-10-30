import { ConfigModule } from '@app/config';
import { Module } from '@nestjs/common';
import historyConfiguration from './config/configuration';
import { registerGrpcClients } from '@app/microservice/utils';
import { Service } from '@app/microservice/services';

@Module({
  imports: [
    ConfigModule.loadConfiguration(historyConfiguration),
    registerGrpcClients([
      Service.MATCHING_SERVICE,
      Service.COLLABORATION_SERVICE,
    ]),
  ],
  controllers: [],
  providers: [],
})
export class HistoryModule {}
