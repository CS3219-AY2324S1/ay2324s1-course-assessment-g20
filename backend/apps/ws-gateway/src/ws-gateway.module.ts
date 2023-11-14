import { Module } from '@nestjs/common';
import { ConfigModule } from '@app/config';
import wsGatewayConfiguration from './config/configuration';
import { YjsGateway } from './websocket-gateways/yjs.gateway';
import { MatchingGateway } from './websocket-gateways/matching.gateway';
import { MatchingWebsocketService } from './services/matchingWebsocketService';
import { YjsWebsocketTrackingService } from './services/yjsWebsocketTrackingService';
import { registerGrpcClients } from '@app/microservice/utils';
import { Service } from '@app/microservice/services';
import { MatchingWebsocketController } from './controller/matchingWebsocket.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.loadConfiguration(wsGatewayConfiguration),
    registerGrpcClients([
      Service.COLLABORATION_SERVICE,
      Service.USER_SERVICE,
      Service.MATCHING_SERVICE,
      Service.QUESTION_SERVICE, // for ws testing setup
    ]),
  ],
  controllers: [MatchingWebsocketController],
  providers: [
    YjsGateway,
    MatchingGateway,
    MatchingWebsocketService,
    YjsWebsocketTrackingService,
  ],
})
export class WsGatewayModule {}
